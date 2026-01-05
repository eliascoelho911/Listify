import type { ShoppingRepository } from '@domain/shopping/ports/ShoppingRepository';
import type { SqliteDatabase } from '@infra/storage/sqlite/SqliteDatabase';

export type AppDependencies = {
  database: SqliteDatabase;
  shoppingRepository: ShoppingRepository;
};

export type BuildDependenciesOptions = {
  databaseName?: string;
};
