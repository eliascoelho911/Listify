/**
 * Persistence contract for SearchHistoryEntry entity.
 * Defines the row type that SQLite/Drizzle must produce.
 */
export interface SearchHistoryRow {
  id: string;
  query: string;
  searched_at: number; // timestamp ms
}

export interface CreateSearchHistoryRow {
  id: string;
  query: string;
  searched_at: number;
}
