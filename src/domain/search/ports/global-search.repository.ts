import type { BaseSortField, SearchUseCase } from '../../common';
import type { GlobalSearchCriteria, GlobalSearchResultItem } from '../types/global-search.types';

export type GlobalSearchRepository<TItem, TList> = SearchUseCase<
  GlobalSearchResultItem<TItem, TList>,
  GlobalSearchCriteria,
  BaseSortField
>;
