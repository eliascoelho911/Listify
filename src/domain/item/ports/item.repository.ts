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
  CreateInterestItemInput,
  CreateNoteItemInput,
  CreateShoppingItemInput,
  InterestItem,
  Item,
  NoteItem,
  ShoppingItem,
  UpdateInterestItemInput,
  UpdateNoteItemInput,
  UpdateShoppingItemInput,
} from '../entities/item.entity';
import type {
  InterestItemFilterCriteria,
  ItemGroupCriteria,
  ItemSortField,
  NoteItemFilterCriteria,
  ShoppingItemFilterCriteria,
} from '../types/item.filter';
import type { ShoppingListSummary } from '../value-objects';

// Repository base com operações comuns
type BaseItemRepository<T extends Item> = ReadUseCase<T, ItemSortField> &
  DeleteUseCase & {
    getByListId(listId: string): Promise<T[]>;
    getBySectionId(sectionId: string): Promise<T[]>;
  };

// Repository específico para NoteItem
export type NoteItemRepository = BaseItemRepository<NoteItem> &
  CreateUseCase<NoteItem, CreateNoteItemInput> &
  UpdateUseCase<NoteItem, UpdateNoteItemInput> &
  SearchUseCase<NoteItem, NoteItemFilterCriteria, ItemSortField> &
  GroupUseCase<NoteItem, ItemGroupCriteria>;

// Repository específico para ShoppingItem
export type ShoppingItemRepository = BaseItemRepository<ShoppingItem> &
  CreateUseCase<ShoppingItem, CreateShoppingItemInput> &
  UpdateUseCase<ShoppingItem, UpdateShoppingItemInput> &
  SearchUseCase<ShoppingItem, ShoppingItemFilterCriteria, ItemSortField> &
  GroupUseCase<ShoppingItem, ItemGroupCriteria> &
  UpdateSortOrderUseCase & {
    getSummary(listId: string): Promise<ShoppingListSummary>;
  };

// Repository específico para InterestItem
export type InterestItemRepository = BaseItemRepository<InterestItem> &
  CreateUseCase<InterestItem, CreateInterestItemInput> &
  UpdateUseCase<InterestItem, UpdateInterestItemInput> &
  SearchUseCase<InterestItem, InterestItemFilterCriteria, ItemSortField> &
  GroupUseCase<InterestItem, ItemGroupCriteria>;
