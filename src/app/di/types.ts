import type { CategoryInference, MediaProviderRepository, SmartInputParser } from '@domain/common';
import type {
  BookItemRepository,
  GameItemRepository,
  Item,
  MovieItemRepository,
  NoteItemRepository,
  ShoppingItemRepository,
} from '@domain/item';
import type { List, ListRepository } from '@domain/list';
import type { PurchaseHistoryRepository } from '@domain/purchase-history';
import type { GlobalSearchRepository } from '@domain/search';
import type { SearchHistoryRepository } from '@domain/search-history';
import type { SectionRepository } from '@domain/section';
import type { UserPreferencesRepository, UserRepository } from '@domain/user';
import type { DrizzleDB } from '@infra/drizzle';

export type { DrizzleDB };

export type AppDependencies = {
  db: DrizzleDB;
  listRepository: ListRepository;
  sectionRepository: SectionRepository;
  noteItemRepository: NoteItemRepository;
  shoppingItemRepository: ShoppingItemRepository;
  movieItemRepository: MovieItemRepository;
  bookItemRepository: BookItemRepository;
  gameItemRepository: GameItemRepository;
  userRepository: UserRepository;
  userPreferencesRepository: UserPreferencesRepository;
  purchaseHistoryRepository: PurchaseHistoryRepository;
  searchHistoryRepository: SearchHistoryRepository;
  globalSearchRepository: GlobalSearchRepository<Item, List>;
  smartInputParser: SmartInputParser;
  categoryInference: CategoryInference;
  movieProvider: MediaProviderRepository;
  bookProvider: MediaProviderRepository;
  gameProvider: MediaProviderRepository;
};
