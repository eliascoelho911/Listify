import { BaseFilterCriteria, BaseSortField, DateRange } from '@domain/common';

// Filtros base para Item
type BaseItemFilterCriteria = BaseFilterCriteria & {
  listId?: string;
  tagIds?: string[];
  createdDateRange?: DateRange;
  updatedDateRange?: DateRange;
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
export type ItemSortField = BaseSortField | 'title';
