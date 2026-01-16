import type { BaseFilterCriteria, BaseSortField } from '@domain/common';

import type { ListCategory, ListType } from '../entities/list.entity';

export type ListFilterCriteria = BaseFilterCriteria & {
  category?: ListCategory;
  listType?: ListType;
};

export type ListGroupCriteria = 'category' | 'listType';

// Ordenação
export type ListSortField = BaseSortField | 'name';
