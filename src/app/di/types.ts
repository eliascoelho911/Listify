import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import type { PaginatedUserInputs, Tag, UserInput } from '@domain/inbox/entities';
import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';
import type { CreateUserInputInput, SearchTagsInput } from '@domain/inbox/use-cases';
import type { ShoppingItem } from '@domain/shopping/entities/ShoppingItem';
import type { ShoppingList } from '@domain/shopping/entities/ShoppingList';
import type {
  ShoppingRepository,
  UpdateListPreferencesInput,
} from '@domain/shopping/ports/ShoppingRepository';
import type { GetActiveListStateResult } from '@domain/shopping/use-cases/GetActiveListState';
import type { UpdateItemInput } from '@domain/shopping/use-cases/UpdateItem';
import type * as schema from '@infra/drizzle/schema';
import type { SqliteDatabase } from '@infra/storage/sqlite/SqliteDatabase';

/**
 * Type for the Drizzle database instance.
 * Used internally by the DI container for live queries.
 */
export type DrizzleDB = ExpoSQLiteDatabase<typeof schema>;

/**
 * Inbox domain use cases centralizados no container.
 * Pure functions (GetUserInputsGrouped) não estão incluídas.
 */
export type InboxUseCases = {
  createUserInput: (input: CreateUserInputInput) => Promise<UserInput>;
  updateUserInput: (id: string, text: string) => Promise<UserInput>;
  deleteUserInput: (id: string) => Promise<void>;
  getUserInputs: (page?: number, limit?: number) => Promise<PaginatedUserInputs>;
  searchTags: (input: SearchTagsInput) => Promise<Tag[]>;
};

/**
 * Shopping domain use cases centralizados no container.
 * Pure functions (createItemFromFreeText, computeListSummary) não estão incluídas.
 */
export type ShoppingUseCases = {
  getActiveListState: () => Promise<GetActiveListStateResult>;
  toggleItemPurchased: (itemId: string) => Promise<ShoppingItem>;
  updateItem: (input: UpdateItemInput) => Promise<ShoppingItem>;
  deleteItem: (itemId: string) => Promise<void>;
  updatePreferences: (preferences: UpdateListPreferencesInput) => Promise<ShoppingList>;
};

export type AppDependencies = {
  database: SqliteDatabase;
  drizzleDb: DrizzleDB;
  shoppingRepository: ShoppingRepository;
  inboxRepository: InboxRepository;
  inboxUseCases: InboxUseCases;
  shoppingUseCases: ShoppingUseCases;
};

export type BuildDependenciesOptions = {
  databaseName?: string;
};
