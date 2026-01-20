import type { SortDirection } from '../sort';

export type GroupResult<T, K extends string> = {
  [key in K]?: T[];
};

export type LayoutConfig<GroupCriteria extends string = string> = {
  groupBy: GroupCriteria;
  sortDirection: SortDirection;
};
