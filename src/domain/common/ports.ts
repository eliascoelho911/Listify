import type {
  BaseFilterCriteria,
  BaseSortField,
  FilterResult,
  GroupResult,
  SortCriteria,
} from './types';

export interface CreateUseCase<T, Input> {
  create(input: Input): Promise<T>;
}

export interface ReadUseCase<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
}

export interface UpdateUseCase<T, Input> {
  update(id: string, updates: Input): Promise<T | null>;
}

export interface DeleteUseCase {
  delete(id: string): Promise<boolean>;
}

export interface FilterUseCase<
  T,
  Criteria extends BaseFilterCriteria,
  SortField extends BaseSortField | string = BaseSortField,
> {
  filter(criteria: Criteria, sort?: SortCriteria<SortField>): Promise<FilterResult<T>>;
}

export interface GroupUseCase<T, Criteria extends string> {
  groupBy(criteria: Criteria): Promise<GroupResult<T, Criteria>>;
}
