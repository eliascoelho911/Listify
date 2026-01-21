import type { CreateSearchHistoryEntryInput, SearchHistoryEntry } from '@domain/search-history';

import type { CreateSearchHistoryRow, SearchHistoryRow } from '../persistence';

/**
 * Convert SQLite row to domain SearchHistoryEntry entity
 */
export function toDomainSearchHistoryEntry(row: SearchHistoryRow): SearchHistoryEntry {
  return {
    id: row.id,
    query: row.query,
    searchedAt: new Date(row.searched_at),
  };
}

/**
 * Convert domain CreateSearchHistoryEntryInput to SQLite row for insertion
 */
export function toCreateSearchHistoryRow(
  input: CreateSearchHistoryEntryInput,
  id: string,
): CreateSearchHistoryRow {
  return {
    id,
    query: input.query,
    searched_at: input.searchedAt.getTime(),
  };
}
