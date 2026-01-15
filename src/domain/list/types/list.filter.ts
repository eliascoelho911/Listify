import type { DateRange } from '../../common';
import type { ListCategory, ListType } from '../entities/list.entity';

export type ListFilterCriteria = {
  query?: string;
  category?: ListCategory;
  listType?: ListType;
  createdDateRange?: DateRange;
  updatedDateRange?: DateRange;
};

export type ListGroupCriteria = 'category' | 'listType';
