import type { CreateUseCase, DeleteUseCase } from '../../common';
import type {
  CreateSearchHistoryEntryInput,
  SearchHistoryEntry,
} from '../entities/search-history.entity';

export interface SearchHistoryRepository
  extends CreateUseCase<SearchHistoryEntry, CreateSearchHistoryEntryInput>, DeleteUseCase {
  getRecent(limit?: number): Promise<SearchHistoryEntry[]>;
  clearAll(): Promise<void>;
}
