export type DateRange = {
  from: Date;
  to: Date;
};

export type FilterResult<T> = {
  items: T[];
  totalCount: number;
};

export type GroupResult<T, K extends string> = {
  [key in K]?: T[];
};
