import type { BaseFilterCriteria, DateRange } from '../../common';

export type GlobalSearchTarget = 'items' | 'lists' | 'all';

export type GlobalSearchCriteria = BaseFilterCriteria & {
  target: GlobalSearchTarget;
  dateRange?: DateRange;
  listId?: string;
};

export type GlobalSearchResultItem<TItem, TList> =
  | { entityType: 'item'; entity: TItem }
  | { entityType: 'list'; entity: TList };
