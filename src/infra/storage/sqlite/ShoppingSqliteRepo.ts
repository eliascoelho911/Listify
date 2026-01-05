import type { Category } from '@domain/shopping/entities/Category';
import type { ShoppingItem } from '@domain/shopping/entities/ShoppingItem';
import type { ShoppingList } from '@domain/shopping/entities/ShoppingList';
import type { ShoppingRepository } from '@domain/shopping/ports/ShoppingRepository';
import {
  mapCategoryEntityToRow,
  mapCategoryRowToEntity,
  mapItemEntityToRow,
  mapItemRowToEntity,
  mapListRowToEntity,
  type CategoryRow,
  type ItemRow,
  type ShoppingListRow,
} from '@data/shopping/mappers/sqliteMappers';
import type {
  SQLiteDatabase as ExpoSQLiteDatabase,
  SQLiteVariadicBindParams,
} from 'expo-sqlite';

import { SqliteDatabase } from './SqliteDatabase';

type SqlExecutor = {
  run: (sql: string, ...params: SQLiteVariadicBindParams) => Promise<unknown>;
  getAll: <T>(sql: string, ...params: SQLiteVariadicBindParams) => Promise<T[]>;
  getFirst: <T>(sql: string, ...params: SQLiteVariadicBindParams) => Promise<T | null>;
};

const PREDEFINED_CATEGORY_NAMES = [
  'hortifruti',
  'mercearia',
  'açougue',
  'laticínios',
  'padaria',
  'bebidas',
  'limpeza',
  'higiene',
  'congelados',
  'pet',
  'outros',
];

export class ShoppingSqliteRepo implements ShoppingRepository {
  private readonly executor: SqlExecutor;
  private readonly isTransactionBound: boolean;

  constructor(
    private readonly db: SqliteDatabase,
    executor?: SqlExecutor,
    isTransactionBound = false
  ) {
    this.executor = executor ?? this.createExecutorFromDb(db);
    this.isTransactionBound = isTransactionBound;
  }

  async getActiveList(): Promise<ShoppingList> {
    await this.ensureSeeded();
    const row = await this.executor.getFirst<ShoppingListRow>(
      'SELECT * FROM lists ORDER BY created_at ASC LIMIT 1'
    );
    if (!row) {
      throw new Error('Não foi possível carregar a lista ativa.');
    }
    return mapListRowToEntity(row);
  }

  async getCategories(): Promise<Category[]> {
    await this.ensureSeeded();
    const rows = await this.executor.getAll<CategoryRow>(
      'SELECT * FROM categories ORDER BY sort_order ASC, name ASC'
    );
    return rows.map(mapCategoryRowToEntity);
  }

  async getItems(listId: string): Promise<ShoppingItem[]> {
    const rows = await this.executor.getAll<ItemRow>(
      'SELECT * FROM items WHERE list_id = ? ORDER BY category_id ASC, status ASC, position ASC',
      listId
    );
    return rows.map(mapItemRowToEntity);
  }

  async upsertItem(item: ShoppingItem): Promise<void> {
    const now = new Date();
    const execute = async (executor: SqlExecutor) => {
      const position = await this.resolvePosition(executor, item);
      const existing = await executor.getFirst<{ count: number }>(
        'SELECT COUNT(*) as count FROM items WHERE id = ?',
        item.id
      );

      const entity: ShoppingItem = {
        ...item,
        position,
        createdAt: item.createdAt ?? now,
        updatedAt: now,
      };
      const row = mapItemEntityToRow(entity);

      if (existing?.count) {
        await executor.run(
          `UPDATE items SET
            list_id = ?,
            name = ?,
            quantity_num = ?,
            unit = ?,
            category_id = ?,
            status = ?,
            position = ?,
            created_at = ?,
            updated_at = ?,
            purchased_at = ?,
            unit_price_minor = ?,
            total_price_minor = ?
          WHERE id = ?`,
          row.list_id,
          row.name,
          row.quantity_num,
          row.unit,
          row.category_id,
          row.status,
          row.position,
          row.created_at,
          row.updated_at,
          row.purchased_at,
          row.unit_price_minor,
          row.total_price_minor,
          row.id
        );
      } else {
        await executor.run(
          `INSERT INTO items (
            id, list_id, name, quantity_num, unit, category_id, status, position,
            created_at, updated_at, purchased_at, unit_price_minor, total_price_minor
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          row.id,
          row.list_id,
          row.name,
          row.quantity_num,
          row.unit,
          row.category_id,
          row.status,
          row.position,
          row.created_at,
          row.updated_at,
          row.purchased_at,
          row.unit_price_minor,
          row.total_price_minor
        );
      }
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

  async deleteItem(itemId: string): Promise<void> {
    await this.executor.run('DELETE FROM items WHERE id = ?', itemId);
  }

  async upsertCategory(category: Category): Promise<void> {
    const row = mapCategoryEntityToRow(category);
    await this.executor.run(
      `INSERT INTO categories (id, name, is_predefined, sort_order)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         is_predefined = excluded.is_predefined,
         sort_order = excluded.sort_order`,
      row.id,
      row.name,
      row.is_predefined,
      row.sort_order
    );
  }

  async transaction<T>(fn: (repo: ShoppingRepository) => Promise<T>): Promise<T> {
    return this.db.transaction(async (txn) => {
      const executor = this.createExecutorFromTxn(txn);
      const transactionRepo = new ShoppingSqliteRepo(this.db, executor, true);
      return fn(transactionRepo);
    });
  }

  private async ensureSeeded(): Promise<void> {
    const seed = async (executor: SqlExecutor) => {
      const listCount = await executor.getFirst<{ count: number }>(
        'SELECT COUNT(*) as count FROM lists'
      );
      const hasList = (listCount?.count ?? 0) > 0;

      if (!hasList) {
        const listId = this.generateId();
        const nowIso = new Date().toISOString();
        await executor.run(
          `INSERT INTO lists (
            id, created_at, updated_at, currency_code, is_completed,
            completed_at, hide_purchased_by_default, ask_price_on_purchase
          ) VALUES (?, ?, ?, ?, 0, NULL, 0, 0)`,
          listId,
          nowIso,
          nowIso,
          'BRL'
        );
      }

      const categoryCount = await executor.getFirst<{ count: number }>(
        'SELECT COUNT(*) as count FROM categories'
      );
      if ((categoryCount?.count ?? 0) === 0) {
        const categories = this.buildDefaultCategories();
        for (const category of categories) {
          const row = mapCategoryEntityToRow(category);
          await executor.run(
            'INSERT INTO categories (id, name, is_predefined, sort_order) VALUES (?, ?, ?, ?)',
            row.id,
            row.name,
            row.is_predefined,
            row.sort_order
          );
        }
      }
    };

    if (this.isTransactionBound) {
      await seed(this.executor);
      return;
    }

    await this.db.transaction(async (txn) => {
      const executor = this.createExecutorFromTxn(txn);
      await seed(executor);
    });
  }

  private buildDefaultCategories(): Category[] {
    return PREDEFINED_CATEGORY_NAMES.map((name, index) => ({
      id: this.generateId(),
      name,
      isPredefined: true,
      sortOrder: index + 1,
    }));
  }

  private async resolvePosition(executor: SqlExecutor, item: ShoppingItem): Promise<number> {
    if (Number.isFinite(item.position)) {
      return item.position;
    }

    const result = await executor.getFirst<{ maxPosition: number }>(
      'SELECT MAX(position) as maxPosition FROM items WHERE category_id = ? AND status = ?',
      item.categoryId,
      item.status
    );
    return (result?.maxPosition ?? 0) + 1;
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto && typeof crypto.randomUUID === 'function') {
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
