import type {
  CreateUseCase,
  ReadUseCase,
  UpdateUseCase,
  DeleteUseCase,
  FilterUseCase,
  GroupUseCase,
} from '../../common';
import type {
  Item,
  NoteItem,
  ShoppingItem,
  InterestItem,
  CreateNoteItemInput,
  CreateShoppingItemInput,
  CreateInterestItemInput,
  UpdateNoteItemInput,
  UpdateShoppingItemInput,
  UpdateInterestItemInput,
} from '../entities/item.entity';
import type {
  NoteItemFilterCriteria,
  ShoppingItemFilterCriteria,
  InterestItemFilterCriteria,
  ItemGroupCriteria,
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
  FilterUseCase<NoteItem, NoteItemFilterCriteria> &
  GroupUseCase<NoteItem, ItemGroupCriteria>;

// Repository específico para ShoppingItem
export type ShoppingItemRepository = BaseItemRepository<ShoppingItem> &
  CreateUseCase<ShoppingItem, CreateShoppingItemInput> &
  UpdateUseCase<ShoppingItem, UpdateShoppingItemInput> &
  FilterUseCase<ShoppingItem, ShoppingItemFilterCriteria> &
  GroupUseCase<ShoppingItem, ItemGroupCriteria>;

// Repository específico para InterestItem
export type InterestItemRepository = BaseItemRepository<InterestItem> &
  CreateUseCase<InterestItem, CreateInterestItemInput> &
  UpdateUseCase<InterestItem, UpdateInterestItemInput> &
  FilterUseCase<InterestItem, InterestItemFilterCriteria> &
  GroupUseCase<InterestItem, ItemGroupCriteria>;
