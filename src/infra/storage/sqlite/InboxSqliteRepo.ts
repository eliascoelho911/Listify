import type { SQLiteDatabase as ExpoSQLiteDatabase, SQLiteVariadicBindParams } from 'expo-sqlite';

import { DEFAULT_PAGE_SIZE, TAG_REGEX } from '@domain/inbox/constants';
import type { Tag, UserInput } from '@domain/inbox/entities';
import type {
  CreateUserInputParams,
  GetUserInputsParams,
  InboxRepository,
  SearchTagsParams,
  UpdateUserInputParams,
} from '@domain/inbox/ports/InboxRepository';
import { UserInputNotFoundError } from '@domain/inbox/use-cases/errors';
import { mapTagRowToEntity, mapUserInputRowToEntity } from '@data/inbox/mappers/sqliteMappers';
import type { TagRow, UserInputRow } from '@data/inbox/mappers/types';

import { SqliteDatabase } from './SqliteDatabase';

type SqlExecutor = {
  run: (sql: string, ...params: SQLiteVariadicBindParams) => Promise<unknown>;
  getAll: <T>(sql: string, ...params: SQLiteVariadicBindParams) => Promise<T[]>;
  getFirst: <T>(sql: string, ...params: SQLiteVariadicBindParams) => Promise<T | null>;
};

export class InboxSqliteRepo implements InboxRepository {
  private readonly executor: SqlExecutor;
  private readonly isTransactionBound: boolean;

  constructor(
    private readonly db: SqliteDatabase,
    executor?: SqlExecutor,
    isTransactionBound = false,
  ) {
    this.executor = executor ?? this.createExecutorFromDb(db);
    this.isTransactionBound = isTransactionBound;
  }

  async createUserInput(params: CreateUserInputParams): Promise<UserInput> {
    const now = new Date();
    const inputId = this.generateId();
    const tagNames = this.extractTagNames(params.text);

    const execute = async (executor: SqlExecutor): Promise<UserInput> => {
      await executor.run(
        `INSERT INTO user_inputs (id, text, created_at, updated_at)
         VALUES (?, ?, ?, ?)`,
        inputId,
        params.text,
        now.toISOString(),
        now.toISOString(),
      );

      const tags: Tag[] = [];
      for (const tagName of tagNames) {
        const tag = await this.getOrCreateTag(executor, tagName, now);
        tags.push(tag);

        await executor.run(
          `INSERT INTO input_tags (input_id, tag_id) VALUES (?, ?)`,
          inputId,
          tag.id,
        );
      }

      return {
        id: inputId,
        text: params.text,
        createdAt: now,
        updatedAt: now,
        tags,
      };
    };

    if (this.isTransactionBound) {
      return execute(this.executor);
    }

    return this.db.transaction(async (txn) => {
      const transactionExecutor = this.createExecutorFromTxn(txn);
      return execute(transactionExecutor);
    });
  }

  async updateUserInput(params: UpdateUserInputParams): Promise<UserInput> {
    const now = new Date();

    const execute = async (executor: SqlExecutor): Promise<UserInput> => {
      const existing = await executor.getFirst<UserInputRow>(
        'SELECT * FROM user_inputs WHERE id = ?',
        params.id,
      );

      if (!existing) {
        throw new UserInputNotFoundError(params.id);
      }

      const newText = params.text ?? existing.text;
      const newTagNames = params.tagNames ?? this.extractTagNames(newText);

      await executor.run(
        `UPDATE user_inputs SET text = ?, updated_at = ? WHERE id = ?`,
        newText,
        now.toISOString(),
        params.id,
      );

      const currentTags = await executor.getAll<TagRow>(
        `SELECT t.* FROM tags t
         INNER JOIN input_tags it ON t.id = it.tag_id
         WHERE it.input_id = ?`,
        params.id,
      );

      for (const oldTag of currentTags) {
        await executor.run(`UPDATE tags SET usage_count = usage_count - 1 WHERE id = ?`, oldTag.id);
      }

      await executor.run(`DELETE FROM input_tags WHERE input_id = ?`, params.id);

      const tags: Tag[] = [];
      for (const tagName of newTagNames) {
        const tag = await this.getOrCreateTag(executor, tagName, now);
        tags.push(tag);

        await executor.run(
          `INSERT INTO input_tags (input_id, tag_id) VALUES (?, ?)`,
          params.id,
          tag.id,
        );
      }

      return {
        id: params.id,
        text: newText,
        createdAt: new Date(existing.created_at),
        updatedAt: now,
        tags,
      };
    };

    if (this.isTransactionBound) {
      return execute(this.executor);
    }

    return this.db.transaction(async (txn) => {
      const transactionExecutor = this.createExecutorFromTxn(txn);
      return execute(transactionExecutor);
    });
  }

  async deleteUserInput(id: string): Promise<void> {
    const execute = async (executor: SqlExecutor): Promise<void> => {
      const existing = await executor.getFirst<UserInputRow>(
        'SELECT * FROM user_inputs WHERE id = ?',
        id,
      );

      if (!existing) {
        throw new UserInputNotFoundError(id);
      }

      const currentTags = await executor.getAll<TagRow>(
        `SELECT t.* FROM tags t
         INNER JOIN input_tags it ON t.id = it.tag_id
         WHERE it.input_id = ?`,
        id,
      );

      for (const tag of currentTags) {
        await executor.run(`UPDATE tags SET usage_count = usage_count - 1 WHERE id = ?`, tag.id);
      }

      await executor.run('DELETE FROM user_inputs WHERE id = ?', id);
    };

    if (this.isTransactionBound) {
      await execute(this.executor);
      return;
    }

    await this.db.transaction(async (txn) => {
      const transactionExecutor = this.createExecutorFromTxn(txn);
      await execute(transactionExecutor);
    });
  }

  async getUserInputById(id: string): Promise<UserInput | null> {
    const row = await this.executor.getFirst<UserInputRow>(
      'SELECT * FROM user_inputs WHERE id = ?',
      id,
    );

    if (!row) {
      return null;
    }

    const tags = await this.getTagsForInput(id);
    return mapUserInputRowToEntity(row, tags);
  }

  async getUserInputs(params: GetUserInputsParams): Promise<{
    inputs: UserInput[];
    hasMore: boolean;
    total?: number;
  }> {
    const limit = params.limit ?? DEFAULT_PAGE_SIZE;
    const offset = params.page * limit;

    const rows = await this.executor.getAll<UserInputRow>(
      `SELECT * FROM user_inputs
       ORDER BY created_at ASC
       LIMIT ? OFFSET ?`,
      limit + 1,
      offset,
    );

    const hasMore = rows.length > limit;
    const pageRows = hasMore ? rows.slice(0, limit) : rows;

    const inputs: UserInput[] = [];
    for (const row of pageRows) {
      const tags = await this.getTagsForInput(row.id);
      inputs.push(mapUserInputRowToEntity(row, tags));
    }

    const totalResult = await this.executor.getFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM user_inputs',
    );

    return {
      inputs,
      hasMore,
      total: totalResult?.count,
    };
  }

  async searchTags(params: SearchTagsParams): Promise<Tag[]> {
    const limit = params.limit ?? 10;
    const query = params.query.toLowerCase();

    const rows = await this.executor.getAll<TagRow>(
      `SELECT * FROM tags
       WHERE name LIKE ? || '%'
       ORDER BY usage_count DESC
       LIMIT ?`,
      query,
      limit,
    );

    return rows.map(mapTagRowToEntity);
  }

  async getAllTags(): Promise<Tag[]> {
    const rows = await this.executor.getAll<TagRow>('SELECT * FROM tags ORDER BY usage_count DESC');
    return rows.map(mapTagRowToEntity);
  }

  async transaction<T>(fn: (repo: InboxRepository) => Promise<T>): Promise<T> {
    return this.db.transaction(async (txn) => {
      const executor = this.createExecutorFromTxn(txn);
      const transactionRepo = new InboxSqliteRepo(this.db, executor, true);
      return fn(transactionRepo);
    });
  }

  private async getTagsForInput(inputId: string): Promise<Tag[]> {
    const rows = await this.executor.getAll<TagRow>(
      `SELECT t.* FROM tags t
       INNER JOIN input_tags it ON t.id = it.tag_id
       WHERE it.input_id = ?
       ORDER BY t.name ASC`,
      inputId,
    );
    return rows.map(mapTagRowToEntity);
  }

  private async getOrCreateTag(executor: SqlExecutor, name: string, now: Date): Promise<Tag> {
    const normalizedName = name.toLowerCase();

    const existing = await executor.getFirst<TagRow>(
      'SELECT * FROM tags WHERE name = ?',
      normalizedName,
    );

    if (existing) {
      await executor.run('UPDATE tags SET usage_count = usage_count + 1 WHERE id = ?', existing.id);
      return {
        ...mapTagRowToEntity(existing),
        usageCount: existing.usage_count + 1,
      };
    }

    const tagId = this.generateId();
    await executor.run(
      `INSERT INTO tags (id, name, usage_count, created_at)
       VALUES (?, ?, 1, ?)`,
      tagId,
      normalizedName,
      now.toISOString(),
    );

    return {
      id: tagId,
      name: normalizedName,
      usageCount: 1,
      createdAt: now,
    };
  }

  private extractTagNames(text: string): string[] {
    const matches = text.matchAll(TAG_REGEX);
    const tagNames = [...matches].map((m) => m[1].toLowerCase());
    return [...new Set(tagNames)];
  }

  private generateId(): string {
    if (
      typeof crypto !== 'undefined' &&
      'randomUUID' in crypto &&
      typeof crypto.randomUUID === 'function'
    ) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private createExecutorFromDb(db: SqliteDatabase): SqlExecutor {
    return {
      run: (sql, ...params) => db.run(sql, ...params),
      getAll: (sql, ...params) => db.getAll(sql, ...params),
      getFirst: (sql, ...params) => db.getFirst(sql, ...params),
    };
  }

  private createExecutorFromTxn(txn: ExpoSQLiteDatabase): SqlExecutor {
    return {
      run: (sql, ...params) => txn.runAsync(sql, ...params),
      getAll: (sql, ...params) => txn.getAllAsync(sql, ...params),
      getFirst: async (sql, ...params) => {
        const result = await txn.getFirstAsync(sql, ...params);
        return result ?? null;
      },
    };
  }
}
