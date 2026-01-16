import type { ItemType } from '../entities/item.entity';

// Filtros base
type BaseItemFilterCriteria = {
  query?: string;
  listId?: string;
  tagIds?: string[];
};

// Filtros por tipo
export type NoteItemFilterCriteria = BaseItemFilterCriteria & {
  type: 'note';
};

export type ShoppingItemFilterCriteria = BaseItemFilterCriteria & {
  type: 'shopping';
  isChecked?: boolean;
};

export type InterestItemFilterCriteria = BaseItemFilterCriteria & {
  type: 'interest';
  isChecked?: boolean;
};

export type ItemFilterCriteria =
  | NoteItemFilterCriteria
  | ShoppingItemFilterCriteria
  | InterestItemFilterCriteria;

// Agrupamentos
export type ItemGroupCriteria = 'listId' | 'tagId' | 'isChecked';

// Ordenação
export type ItemSortField = 'createdAt' | 'updatedAt' | 'title';
