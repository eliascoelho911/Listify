import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import {
  createUserInput,
  DeleteUserInput,
  GetUserInputs,
  SearchTags,
  UpdateUserInput,
} from '@domain/inbox/use-cases';
import { deleteItem } from '@domain/shopping/use-cases/DeleteItem';
import { getActiveListState } from '@domain/shopping/use-cases/GetActiveListState';
import { toggleItemPurchased } from '@domain/shopping/use-cases/ToggleItemPurchased';
import { updateItem } from '@domain/shopping/use-cases/UpdateItem';
import { updatePreferences } from '@domain/shopping/use-cases/UpdatePreferences';
import { InboxDrizzleRepo } from '@infra/drizzle/InboxDrizzleRepo';
import * as schema from '@infra/drizzle/schema';
import { ShoppingSqliteRepo } from '@infra/storage/sqlite/ShoppingSqliteRepo';
import { SqliteDatabase } from '@infra/storage/sqlite/SqliteDatabase';

import type {
  AppDependencies,
  BuildDependenciesOptions,
  InboxUseCases,
  ShoppingUseCases,
} from './types';

export async function buildDependencies(
  options: BuildDependenciesOptions = {},
): Promise<AppDependencies> {
  const databaseName = options.databaseName ?? 'listify.db';
  const database = new SqliteDatabase({ databaseName });
  const shoppingRepository = new ShoppingSqliteRepo(database);

  const rawDb = openDatabaseSync(databaseName, { enableChangeListener: true });
  rawDb.execSync('PRAGMA foreign_keys = ON;');
  const drizzleDb = drizzle(rawDb, { schema });
  const inboxRepository = new InboxDrizzleRepo(drizzleDb);

  await shoppingRepository.getActiveList();

  // Clock factory para UseCases que precisam de timestamps
  const clock = () => new Date();

  // Inbox UseCases - bind repository nas funções
  const inboxUseCases: InboxUseCases = {
    createUserInput: (input) => createUserInput(input, { repository: inboxRepository }),

    updateUserInput: (id, text) => UpdateUserInput(inboxRepository, id, text),

    deleteUserInput: (id) => DeleteUserInput(inboxRepository, id),

    getUserInputs: (page = 0, limit = 20) => GetUserInputs(inboxRepository, page, limit),

    searchTags: (input) => SearchTags(input, (params) => inboxRepository.searchTags(params)),
  };

  // Shopping UseCases - bind repository e clock
  const shoppingUseCases: ShoppingUseCases = {
    getActiveListState: () => getActiveListState({ repository: shoppingRepository }),

    toggleItemPurchased: (itemId) =>
      toggleItemPurchased(itemId, { repository: shoppingRepository, clock }),

    updateItem: (input) => updateItem(input, { repository: shoppingRepository, clock }),

    deleteItem: (itemId) => deleteItem(itemId, { repository: shoppingRepository }),

    updatePreferences: (preferences) =>
      updatePreferences(preferences, { repository: shoppingRepository }),
  };

  return {
    database,
    shoppingRepository,
    inboxRepository,
    inboxUseCases,
    shoppingUseCases,
  };
}
