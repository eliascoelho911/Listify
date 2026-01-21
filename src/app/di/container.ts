import type { DrizzleDB } from '@infra/drizzle';
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
import { CategoryInferenceService, SmartInputParserService } from '@infra/services';

import type { AppDependencies } from './types';

/**
 * Builds all app dependencies synchronously.
 * Database must already be initialized with migrations completed.
 */
export function buildDependenciesSync(db: DrizzleDB): AppDependencies {
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
  const categoryInference = new CategoryInferenceService();

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
    categoryInference,
  };
}
