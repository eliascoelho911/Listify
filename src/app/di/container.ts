import { initializeDatabase } from '@infra/drizzle';
import {
  DrizzleBookItemRepository,
  DrizzleGameItemRepository,
  DrizzleGlobalSearchRepository,
  DrizzleListRepository,
  DrizzleMovieItemRepository,
  DrizzleNoteItemRepository,
  DrizzlePurchaseHistoryRepository,
  DrizzleSearchHistoryRepository,
  DrizzleSectionRepository,
  DrizzleShoppingItemRepository,
  DrizzleUserPreferencesRepository,
  DrizzleUserRepository,
} from '@infra/repositories';
import { SmartInputParserService } from '@infra/services';

import type { AppDependencies, BuildDependenciesOptions } from './types';

export async function buildDependencies(
  options: BuildDependenciesOptions = {},
): Promise<AppDependencies> {
  const db = initializeDatabase(options.databaseName);

  const listRepository = new DrizzleListRepository(db);
  const sectionRepository = new DrizzleSectionRepository(db);
  const noteItemRepository = new DrizzleNoteItemRepository(db);
  const shoppingItemRepository = new DrizzleShoppingItemRepository(db);
  const movieItemRepository = new DrizzleMovieItemRepository(db);
  const bookItemRepository = new DrizzleBookItemRepository(db);
  const gameItemRepository = new DrizzleGameItemRepository(db);
  const userRepository = new DrizzleUserRepository(db);
  const userPreferencesRepository = new DrizzleUserPreferencesRepository(db);
  const purchaseHistoryRepository = new DrizzlePurchaseHistoryRepository(db);
  const searchHistoryRepository = new DrizzleSearchHistoryRepository(db);
  const globalSearchRepository = new DrizzleGlobalSearchRepository(db);

  const smartInputParser = new SmartInputParserService();

  return {
    db,
    listRepository,
    sectionRepository,
    noteItemRepository,
    shoppingItemRepository,
    movieItemRepository,
    bookItemRepository,
    gameItemRepository,
    userRepository,
    userPreferencesRepository,
    purchaseHistoryRepository,
    searchHistoryRepository,
    globalSearchRepository,
    smartInputParser,
  };
}
