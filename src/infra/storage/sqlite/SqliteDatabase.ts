import {
  deleteDatabaseAsync,
  openDatabaseAsync,
  type SQLiteDatabase as ExpoSQLiteDatabase,
  type SQLiteRunResult,
  type SQLiteVariadicBindParams,
} from 'expo-sqlite';

import { type Migration, MIGRATIONS } from './migrations';

export const DEFAULT_DATABASE_NAME = 'listify.db';

export class DatabaseBootstrapError extends Error {
  constructor(
    message: string,
    readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'DatabaseBootstrapError';
  }
}

export class SqliteDatabase {
  private readonly databaseName: string;
  private readonly migrations: Migration[];
  private readonly dbPromise: Promise<ExpoSQLiteDatabase>;

  constructor(
    private readonly options: {
      databaseName?: string;
      migrations?: Migration[];
    } = {},
  ) {
    this.databaseName = this.options.databaseName ?? DEFAULT_DATABASE_NAME;
    this.migrations = (this.options.migrations ?? MIGRATIONS).sort((a, b) => a.id - b.id);
    this.dbPromise = this.initialize();
  }

  private async initialize(): Promise<ExpoSQLiteDatabase> {
    try {
      const db = await openDatabaseAsync(this.databaseName);
      await db.execAsync('PRAGMA foreign_keys = ON;');
      await this.applyMigrations(db);
      return db;
    } catch (error) {
      throw new DatabaseBootstrapError('Failed to initialize database', error);
    }
  }

  private async applyMigrations(db: ExpoSQLiteDatabase): Promise<void> {
    const currentVersionRow = await db.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version;',
    );
    const currentVersion = currentVersionRow?.user_version ?? 0;

    const pending = this.migrations.filter((migration) => migration.id > currentVersion);

    for (const migration of pending) {
      await db.withExclusiveTransactionAsync(async (txn) => {
        await txn.execAsync(migration.sql);
        await txn.execAsync(`PRAGMA user_version = ${migration.id};`);
      });
    }
  }

  static async resetDatabase(databaseName = DEFAULT_DATABASE_NAME): Promise<void> {
    await deleteDatabaseAsync(databaseName);
  }

  private async getDb(): Promise<ExpoSQLiteDatabase> {
    return this.dbPromise;
  }

  async getAll<T>(sql: string, ...params: SQLiteVariadicBindParams): Promise<T[]> {
    const db = await this.getDb();
    return db.getAllAsync<T>(sql, ...params);
  }

  async getFirst<T>(sql: string, ...params: SQLiteVariadicBindParams): Promise<T | null> {
    const db = await this.getDb();
    const result = await db.getFirstAsync<T>(sql, ...params);
    return result ?? null;
  }

  async run(sql: string, ...params: SQLiteVariadicBindParams): Promise<SQLiteRunResult> {
    const db = await this.getDb();
    return db.runAsync(sql, ...params);
  }

  async transaction<T>(fn: (db: ExpoSQLiteDatabase) => Promise<T>): Promise<T> {
    const db = await this.getDb();
    let result: T | undefined;
    await db.withExclusiveTransactionAsync(async (txn) => {
      result = await fn(txn);
    });
    return result as T;
  }
}
