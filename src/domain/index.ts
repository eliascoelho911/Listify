// Common domain types and interfaces
export type {
  BaseFilterCriteria,
  BaseSortField,
  CreateUseCase,
  DateRange,
  DeleteUseCase,
  GetAllUseCase,
  GetByIdUseCase,
  GlobalSearchCriteria,
  GlobalSearchRepository,
  GlobalSearchResultItem,
  GlobalSearchTarget,
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

// List domain
export type {
  CreateListInput,
  InterestListType,
  List,
  ListCategory,
  ListFilterCriteria,
  ListGroupCriteria,
  ListRepository,
  ListSortField,
  ListType,
  ListTypeConfig,
  NotesListType,
  ShoppingListType,
  UpdateListInput,
} from './list';

// Item domain
export type {
  BookMetadata,
  BookProviderRepository,
  BookSearchResult,
  CreateInterestItemInput,
  CreateItemInput,
  CreateNoteItemInput,
  CreateShoppingItemInput,
  ExternalMetadata,
  GameMetadata,
  GameProviderRepository,
  GameSearchResult,
  InterestItem,
  InterestItemFilterCriteria,
  InterestItemRepository,
  Item,
  ItemFilterCriteria,
  ItemGroupCriteria,
  ItemSortField,
  ItemType,
  MetadataCategory,
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
  UpdateInterestItemInput,
  UpdateItemInput,
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
