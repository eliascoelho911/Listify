import 'react-native-get-random-values';

import { desc, eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

import type {
  CreateSearchHistoryEntryInput,
  SearchHistoryEntry,
  SearchHistoryRepository,
} from '@domain/search-history';
import { toCreateSearchHistoryRow, toDomainSearchHistoryEntry } from '@data/mappers';

import type { DrizzleDB } from '../drizzle';
import { searchHistory } from '../drizzle';

export class DrizzleSearchHistoryRepository implements SearchHistoryRepository {
  constructor(private db: DrizzleDB) {}

  async create(input: CreateSearchHistoryEntryInput): Promise<SearchHistoryEntry> {
    const id = uuid();
    const row = toCreateSearchHistoryRow(input, id);

    // Check if query already exists and update it
    const existing = await this.db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.query, input.query))
      .limit(1);

    if (existing.length > 0) {
      // Update existing entry's timestamp
      await this.db
        .update(searchHistory)
        .set({ searchedAt: new Date(row.searched_at) })
        .where(eq(searchHistory.query, input.query));

      return this.mapRowToSearchHistoryEntry({
        ...existing[0],
        searchedAt: new Date(row.searched_at),
      });
    }

    await this.db.insert(searchHistory).values({
      id: row.id,
      query: row.query,
      searchedAt: new Date(row.searched_at),
    });

    const created = await this.getById(id);
    if (!created) {
      throw new Error('Failed to create search history entry');
    }
    return created;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(searchHistory).where(eq(searchHistory.id, id));
    return result.changes > 0;
  }

  async getRecent(limit = 10): Promise<SearchHistoryEntry[]> {
    const rows = await this.db
      .select()
      .from(searchHistory)
      .orderBy(desc(searchHistory.searchedAt))
      .limit(limit);
    return rows.map((row) => this.mapRowToSearchHistoryEntry(row));
  }

  async clearAll(): Promise<void> {
    await this.db.delete(searchHistory);
  }

  private async getById(id: string): Promise<SearchHistoryEntry | null> {
    const result = await this.db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.id, id))
      .limit(1);
    if (result.length === 0) {
      return null;
    }
    return this.mapRowToSearchHistoryEntry(result[0]);
  }

  private mapRowToSearchHistoryEntry(row: typeof searchHistory.$inferSelect): SearchHistoryEntry {
    return toDomainSearchHistoryEntry({
      id: row.id,
      query: row.query,
      searched_at: row.searchedAt.getTime(),
    });
  }
}
