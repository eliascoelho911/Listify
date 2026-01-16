import type {
  BaseFilterCriteria,
  BaseSortField,
  GroupResult,
  PaginatedResult,
  PaginationParams,
  SortCriteria,
  SortOrderUpdate,
} from './types';

export interface CreateUseCase<T, Input> {
  create(input: Input): Promise<T>;
}

export interface GetByIdUseCase<T> {
  getById(id: string): Promise<T | null>;
}

export interface GetAllUseCase<T> {
  getAll(pagination?: PaginationParams): Promise<PaginatedResult<T>>;
}

export interface ReadUseCase<T> extends GetByIdUseCase<T>, GetAllUseCase<T> {}

export interface UpdateUseCase<T, Input> {
  update(id: string, updates: Input): Promise<T | null>;
}

export interface DeleteUseCase {
  delete(id: string): Promise<boolean>;
}

export interface SearchUseCase<
  T,
  Criteria extends BaseFilterCriteria,
  SortField extends BaseSortField | string = BaseSortField,
> {
  search(
    criteria: Criteria,
    sort?: SortCriteria<SortField>,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<T>>;
}

export interface GroupUseCase<T, Criteria extends string> {
  groupBy(criteria: Criteria): Promise<GroupResult<T, Criteria>>;
}

export interface UpdateSortOrderUseCase {
  updateSortOrder(updates: SortOrderUpdate[]): Promise<void>;
}
