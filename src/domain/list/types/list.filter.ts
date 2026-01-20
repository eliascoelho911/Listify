import type { BaseFilterCriteria, BaseSortField } from '@domain/common';

import type { ListType } from '../entities/list.entity';

export type ListFilterCriteria = BaseFilterCriteria & {
  listType?: ListType;
};

export type ListGroupCriteria = 'listType';

export type ListSortField = BaseSortField | 'name';
