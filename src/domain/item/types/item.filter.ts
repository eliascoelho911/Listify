import { BaseFilterCriteria, BaseSortField, DateRange } from '@domain/common';

// Base item filter criteria
type BaseItemFilterCriteria = BaseFilterCriteria & {
  listId?: string;
  sectionId?: string;
  createdDateRange?: DateRange;
  updatedDateRange?: DateRange;
};

// Filters by type
export type NoteItemFilterCriteria = BaseItemFilterCriteria & {
  type: 'note';
};

export type ShoppingItemFilterCriteria = BaseItemFilterCriteria & {
  type: 'shopping';
  isChecked?: boolean;
};

export type MovieItemFilterCriteria = BaseItemFilterCriteria & {
  type: 'movie';
  isChecked?: boolean;
};

export type BookItemFilterCriteria = BaseItemFilterCriteria & {
  type: 'book';
  isChecked?: boolean;
};

export type GameItemFilterCriteria = BaseItemFilterCriteria & {
  type: 'game';
  isChecked?: boolean;
};

export type ItemFilterCriteria =
  | NoteItemFilterCriteria
  | ShoppingItemFilterCriteria
  | MovieItemFilterCriteria
  | BookItemFilterCriteria
  | GameItemFilterCriteria;

// Grouping
export type ItemGroupCriteria = 'listId' | 'sectionId' | 'isChecked' | 'createdAt' | 'updatedAt';

// Sorting
export type ItemSortField = BaseSortField | 'title' | 'sortOrder';
