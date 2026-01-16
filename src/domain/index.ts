// Common domain types and interfaces
export type {
  CreateUseCase,
  DateRange,
  DeleteUseCase,
  FilterResult,
  FilterUseCase,
  GroupResult,
  GroupUseCase,
  ReadUseCase,
  UpdateUseCase,
} from './common';

// Tag domain
export type { CreateTagInput, Tag, TagRepository, UpdateTagInput } from './tag';

// List domain
export type {
  CreateListInput,
  InterestListType,
  List,
  ListCategory,
  ListFilterCriteria,
  ListGroupCriteria,
  ListRepository,
  ListType,
  ListTypeConfig,
  NotesListType,
  ShoppingListType,
  UpdateListInput,
} from './list';

// Item domain
export type {
  BookMetadata,
  CreateInterestItemInput,
  CreateItemInput,
  CreateNoteItemInput,
  CreateShoppingItemInput,
  ExternalMetadata,
  GameMetadata,
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
  NoteItem,
  NoteItemFilterCriteria,
  NoteItemRepository,
  ShoppingItem,
  ShoppingItemFilterCriteria,
  ShoppingItemRepository,
  UpdateInterestItemInput,
  UpdateItemInput,
  UpdateNoteItemInput,
  UpdateShoppingItemInput,
} from './item';

// User domain
export type { User, CreateUserInput, UpdateUserInput, UserRepository } from './user';
