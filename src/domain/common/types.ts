export type DateRange = {
  from: Date;
  to: Date;
};

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

export type GroupResult<T, K extends string> = {
  [key in K]?: T[];
};

export type SortOrderUpdate = {
  id: string;
  sortOrder: number;
};

export type SortDirection = 'asc' | 'desc';

// Campos de ordenação comuns a todas as entidades
export type BaseSortField = 'createdAt' | 'updatedAt';

// Critério de ordenação tipado - SortField deve estender BaseSortField
export type SortCriteria<SortField extends BaseSortField | string> = {
  field: SortField;
  direction: SortDirection;
};

// Critério de filtro base - deve ser estendido por cada domínio
export type BaseFilterCriteria = {
  query?: string;
};

// Configuração de layout reutilizável
export type LayoutConfig<GroupCriteria extends string = string> = {
  groupBy: GroupCriteria;
  sortDirection: SortDirection;
};
