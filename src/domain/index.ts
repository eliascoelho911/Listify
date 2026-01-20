// Common domain types and interfaces
export type {
  BaseFilterCriteria,
  BaseSortField,
  CreateUseCase,
  DateRange,
  DeleteUseCase,
  GetAllUseCase,
  GetByIdUseCase,
  GroupResult,
  GroupUseCase,
  LayoutConfig,
  PaginatedResult,
  PaginationParams,
  ReadUseCase,
  SearchUseCase,
  SortCriteria,
  SortDirection,
  SortOrderUpdate,
  UpdateSortOrderUseCase,
  UpdateUseCase,
} from './common';

// Search domain (global search)
export type {
  GlobalSearchCriteria,
  GlobalSearchRepository,
  GlobalSearchResultItem,
  GlobalSearchTarget,
} from './search';

// List domain
export type {
  BooksList,
  CreateListInput,
  GamesList,
  List,
  ListFilterCriteria,
  ListGroupCriteria,
  ListRepository,
  ListSortField,
  ListType,
  MoviesList,
  NotesList,
  ShoppingList,
  UpdateListInput,
} from './list';

// Item domain
export type {
  BookItem,
  BookItemFilterCriteria,
  BookItemRepository,
  BookMetadata,
  BookProviderRepository,
  BookSearchResult,
  CreateBookItemInput,
  CreateGameItemInput,
  CreateItemInput,
  CreateMovieItemInput,
  CreateNoteItemInput,
  CreateShoppingItemInput,
  ExternalMetadata,
  GameItem,
  GameItemFilterCriteria,
  GameItemRepository,
  GameMetadata,
  GameProviderRepository,
  GameSearchResult,
  Item,
  ItemFilterCriteria,
  ItemGroupCriteria,
  ItemSortField,
  ItemType,
  MetadataCategory,
  MovieItem,
  MovieItemFilterCriteria,
  MovieItemRepository,
  MovieMetadata,
  MovieProviderRepository,
  MovieSearchResult,
  NoteItem,
  NoteItemFilterCriteria,
  NoteItemRepository,
  ShoppingItem,
  ShoppingItemFilterCriteria,
  ShoppingItemRepository,
  ShoppingListSummary,
  UpdateBookItemInput,
  UpdateGameItemInput,
  UpdateItemInput,
  UpdateMovieItemInput,
  UpdateNoteItemInput,
  UpdateShoppingItemInput,
} from './item';

// User domain
export type {
  CreateUserInput,
  CreateUserPreferencesInput,
  LayoutConfigs,
  SpecialLayoutKey,
  Theme,
  UpdateUserInput,
  UpdateUserPreferencesInput,
  User,
  UserPreferences,
  UserPreferencesRepository,
  UserRepository,
} from './user';

// Section domain
export type {
  CreateSectionInput,
  Section,
  SectionRepository,
  SectionSortField,
  UpdateSectionInput,
} from './section';

// Purchase history domain
export type {
  CreatePurchaseHistoryInput,
  PurchaseHistory,
  PurchaseHistoryItem,
  PurchaseHistoryRepository,
  PurchaseHistorySection,
} from './purchase-history';

// Search history domain
export type {
  CreateSearchHistoryEntryInput,
  SearchHistoryEntry,
  SearchHistoryRepository,
} from './search-history';
