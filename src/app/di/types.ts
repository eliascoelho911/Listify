import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';
import type { ShoppingRepository } from '@domain/shopping/ports/ShoppingRepository';
import type { SqliteDatabase } from '@infra/storage/sqlite/SqliteDatabase';

export type AppDependencies = {
  database: SqliteDatabase;
  shoppingRepository: ShoppingRepository;
  inboxRepository: InboxRepository;
};

export type BuildDependenciesOptions = {
  databaseName?: string;
};
