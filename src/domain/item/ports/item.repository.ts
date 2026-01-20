import type {
  CreateUseCase,
  DeleteUseCase,
  GroupUseCase,
  ReadUseCase,
  SearchUseCase,
  UpdateSortOrderUseCase,
  UpdateUseCase,
} from '../../common';
import type {
  BookItem,
  CreateBookItemInput,
  CreateGameItemInput,
  CreateMovieItemInput,
  CreateNoteItemInput,
  CreateShoppingItemInput,
  GameItem,
  Item,
  MovieItem,
  NoteItem,
  ShoppingItem,
  UpdateBookItemInput,
  UpdateGameItemInput,
  UpdateMovieItemInput,
  UpdateNoteItemInput,
  UpdateShoppingItemInput,
} from '../entities/item.entity';
import type {
  BookItemFilterCriteria,
  GameItemFilterCriteria,
  ItemGroupCriteria,
  ItemSortField,
  MovieItemFilterCriteria,
  NoteItemFilterCriteria,
  ShoppingItemFilterCriteria,
} from '../types/item.filter';
import type { ShoppingListSummary } from '../value-objects';

// Base repository with common operations
type BaseItemRepository<T extends Item> = ReadUseCase<T, ItemSortField> &
  DeleteUseCase & {
    getByListId(listId: string): Promise<T[]>;
    getBySectionId(sectionId: string): Promise<T[]>;
  };

// Repository for NoteItem
export type NoteItemRepository = BaseItemRepository<NoteItem> &
  CreateUseCase<NoteItem, CreateNoteItemInput> &
  UpdateUseCase<NoteItem, UpdateNoteItemInput> &
  SearchUseCase<NoteItem, NoteItemFilterCriteria, ItemSortField> &
  GroupUseCase<NoteItem, ItemGroupCriteria>;

// Repository for ShoppingItem
export type ShoppingItemRepository = BaseItemRepository<ShoppingItem> &
  CreateUseCase<ShoppingItem, CreateShoppingItemInput> &
  UpdateUseCase<ShoppingItem, UpdateShoppingItemInput> &
  SearchUseCase<ShoppingItem, ShoppingItemFilterCriteria, ItemSortField> &
  GroupUseCase<ShoppingItem, ItemGroupCriteria> &
  UpdateSortOrderUseCase & {
    getSummary(listId: string): Promise<ShoppingListSummary>;
  };

// Repository for MovieItem
export type MovieItemRepository = BaseItemRepository<MovieItem> &
  CreateUseCase<MovieItem, CreateMovieItemInput> &
  UpdateUseCase<MovieItem, UpdateMovieItemInput> &
  SearchUseCase<MovieItem, MovieItemFilterCriteria, ItemSortField> &
  GroupUseCase<MovieItem, ItemGroupCriteria>;

// Repository for BookItem
export type BookItemRepository = BaseItemRepository<BookItem> &
  CreateUseCase<BookItem, CreateBookItemInput> &
  UpdateUseCase<BookItem, UpdateBookItemInput> &
  SearchUseCase<BookItem, BookItemFilterCriteria, ItemSortField> &
  GroupUseCase<BookItem, ItemGroupCriteria>;

// Repository for GameItem
export type GameItemRepository = BaseItemRepository<GameItem> &
  CreateUseCase<GameItem, CreateGameItemInput> &
  UpdateUseCase<GameItem, UpdateGameItemInput> &
  SearchUseCase<GameItem, GameItemFilterCriteria, ItemSortField> &
  GroupUseCase<GameItem, ItemGroupCriteria>;
