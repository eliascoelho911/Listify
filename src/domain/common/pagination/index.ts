export type PaginationParams = {
  offset: number;
  limit: number;
};

export type PaginatedResult<T> = {
  items: T[];
  totalCount: number;
  pagination: {
    offset: number;
    limit: number;
    hasMore: boolean;
  };
};
