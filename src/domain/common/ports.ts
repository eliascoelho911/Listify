import type {
  BaseFilterCriteria,
  BaseSortField,
  GlobalSearchCriteria,
  GlobalSearchResultItem,
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

export interface GetAllUseCase<T, SortField extends BaseSortField | string = BaseSortField> {
  getAll(
    sort?: SortCriteria<SortField>,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<T>>;
}

export interface ReadUseCase<T, SortField extends BaseSortField | string = BaseSortField>
  extends GetByIdUseCase<T>, GetAllUseCase<T, SortField> {}

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

export type GlobalSearchRepository<TItem, TList> = SearchUseCase<
  GlobalSearchResultItem<TItem, TList>,
  GlobalSearchCriteria,
  BaseSortField
>;
