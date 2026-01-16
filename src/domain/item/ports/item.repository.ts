import type {
  CreateUseCase,
  DeleteUseCase,
  FilterUseCase,
  GroupUseCase,
  ReadUseCase,
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

// Repository base com operações comuns
type BaseItemRepository<T extends Item> = ReadUseCase<T> &
  DeleteUseCase & {
    getByListId(listId: string): Promise<T[]>;
    getByTagId(tagId: string): Promise<T[]>;
    getSubItems(parentId: string): Promise<T[]>;
  };

// Repository específico para NoteItem
export type NoteItemRepository = BaseItemRepository<NoteItem> &
  CreateUseCase<NoteItem, CreateNoteItemInput> &
  UpdateUseCase<NoteItem, UpdateNoteItemInput> &
  FilterUseCase<NoteItem, NoteItemFilterCriteria, ItemSortField> &
  GroupUseCase<NoteItem, ItemGroupCriteria>;

// Repository específico para ShoppingItem
export type ShoppingItemRepository = BaseItemRepository<ShoppingItem> &
  CreateUseCase<ShoppingItem, CreateShoppingItemInput> &
  UpdateUseCase<ShoppingItem, UpdateShoppingItemInput> &
  FilterUseCase<ShoppingItem, ShoppingItemFilterCriteria, ItemSortField> &
  GroupUseCase<ShoppingItem, ItemGroupCriteria>;

// Repository específico para InterestItem
export type InterestItemRepository = BaseItemRepository<InterestItem> &
  CreateUseCase<InterestItem, CreateInterestItemInput> &
  UpdateUseCase<InterestItem, UpdateInterestItemInput> &
  FilterUseCase<InterestItem, InterestItemFilterCriteria, ItemSortField> &
  GroupUseCase<InterestItem, ItemGroupCriteria>;
