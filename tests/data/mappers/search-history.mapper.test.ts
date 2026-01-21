import type { CreateSearchHistoryEntryInput, SearchHistoryEntry } from '@domain/search-history';
import {
  toCreateSearchHistoryRow,
  toDomainSearchHistoryEntry,
} from '@data/mappers/search-history.mapper';
import type { CreateSearchHistoryRow, SearchHistoryRow } from '@data/persistence';

describe('SearchHistory Mapper', () => {
  describe('toDomainSearchHistoryEntry', () => {
    it('should convert SQLite row to domain entity', () => {
      const row: SearchHistoryRow = {
        id: 'uuid-123',
        query: 'leite',
        searched_at: 1704067200000, // 2024-01-01
      };

      const entry = toDomainSearchHistoryEntry(row);

      expect(entry.id).toBe('uuid-123');
      expect(entry.query).toBe('leite');
      expect(entry.searchedAt).toBeInstanceOf(Date);
    });

    it('should handle various query strings', () => {
      const queries = ['simple', 'with spaces', 'with-dashes', 'com acentuação', '123 numbers'];

      queries.forEach((query) => {
        const row: SearchHistoryRow = {
          id: `uuid-${query}`,
          query,
          searched_at: Date.now(),
        };

        const entry = toDomainSearchHistoryEntry(row);
        expect(entry.query).toBe(query);
      });
    });

    it('should convert timestamp to Date correctly', () => {
      const timestamp = 1704067200000; // 2024-01-01 00:00:00 UTC
      const row: SearchHistoryRow = {
        id: 'uuid-1',
        query: 'test',
        searched_at: timestamp,
      };

      const entry = toDomainSearchHistoryEntry(row);

      expect(entry.searchedAt.getTime()).toBe(timestamp);
    });
  });

  describe('toCreateSearchHistoryRow', () => {
    it('should convert domain input to SQLite row', () => {
      const input: CreateSearchHistoryEntryInput = {
        query: 'busca teste',
        searchedAt: new Date('2024-01-15T10:30:00Z'),
      };
      const id = 'generated-uuid';

      const row = toCreateSearchHistoryRow(input, id);

      expect(row.id).toBe('generated-uuid');
      expect(row.query).toBe('busca teste');
      expect(typeof row.searched_at).toBe('number');
    });

    it('should convert Date to timestamp', () => {
      const searchedAt = new Date('2024-01-15T10:30:00Z');

      const input: CreateSearchHistoryEntryInput = {
        query: 'test',
        searchedAt,
      };

      const row = toCreateSearchHistoryRow(input, 'uuid');

      expect(row.searched_at).toBe(searchedAt.getTime());
    });
  });

  describe('roundtrip conversion', () => {
    it('should maintain data integrity through create and read', () => {
      const searchedAt = new Date('2024-01-15T10:30:00Z');

      const input: CreateSearchHistoryEntryInput = {
        query: 'roundtrip query',
        searchedAt,
      };
      const id = 'roundtrip-uuid';

      const createRow = toCreateSearchHistoryRow(input, id);

      const readRow: SearchHistoryRow = {
        id: createRow.id,
        query: createRow.query,
        searched_at: createRow.searched_at,
      };

      const entry = toDomainSearchHistoryEntry(readRow);

      expect(entry.id).toBe(id);
      expect(entry.query).toBe(input.query);
      expect(entry.searchedAt.getTime()).toBe(searchedAt.getTime());
    });
  });

  describe('FIFO pattern support', () => {
    it('should support ordering by searchedAt for FIFO', () => {
      const rows: SearchHistoryRow[] = [
        { id: '1', query: 'oldest', searched_at: 1704067200000 },
        { id: '2', query: 'middle', searched_at: 1704153600000 },
        { id: '3', query: 'newest', searched_at: 1704240000000 },
      ];

      const entries = rows.map(toDomainSearchHistoryEntry);

      // Sort by searchedAt ascending (oldest first)
      const sorted = [...entries].sort((a, b) => a.searchedAt.getTime() - b.searchedAt.getTime());

      expect(sorted[0].query).toBe('oldest');
      expect(sorted[sorted.length - 1].query).toBe('newest');
    });
  });
});
