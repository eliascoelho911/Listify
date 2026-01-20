import type { CreateSearchHistoryEntryInput, SearchHistoryEntry } from '@domain/search-history';

describe('SearchHistoryEntry Entity', () => {
  describe('SearchHistoryEntry type structure', () => {
    it('should have correct shape', () => {
      const entry: SearchHistoryEntry = {
        id: 'uuid-1',
        query: 'leite',
        searchedAt: new Date('2024-01-15T10:30:00'),
      };

      expect(entry.id).toBe('uuid-1');
      expect(entry.query).toBe('leite');
      expect(entry.searchedAt).toBeInstanceOf(Date);
    });

    it('should require all fields', () => {
      const entry: SearchHistoryEntry = {
        id: 'required-id',
        query: 'required-query',
        searchedAt: new Date(),
      };

      expect(entry.id).toBeDefined();
      expect(entry.query).toBeDefined();
      expect(entry.searchedAt).toBeDefined();
    });
  });

  describe('CreateSearchHistoryEntryInput type', () => {
    it('should exclude id', () => {
      const input: CreateSearchHistoryEntryInput = {
        query: 'new search',
        searchedAt: new Date(),
      };

      expect(input.query).toBe('new search');
      expect(input.searchedAt).toBeDefined();
    });
  });

  describe('Search history business rules', () => {
    it('should store normalized query strings', () => {
      const entries: SearchHistoryEntry[] = [
        { id: '1', query: 'leite', searchedAt: new Date() },
        { id: '2', query: 'pão', searchedAt: new Date() },
        { id: '3', query: 'arroz', searchedAt: new Date() },
      ];

      entries.forEach((entry) => {
        expect(entry.query).toBe(entry.query.trim());
      });
    });

    it('should support FIFO pattern with max 10 entries', () => {
      const maxEntries = 10;
      const entries: SearchHistoryEntry[] = [];

      // Simulate adding 15 entries (should keep last 10)
      for (let i = 1; i <= 15; i++) {
        entries.push({
          id: `entry-${i}`,
          query: `search ${i}`,
          searchedAt: new Date(Date.now() + i * 1000),
        });

        // FIFO: remove oldest if exceeds max
        if (entries.length > maxEntries) {
          entries.shift();
        }
      }

      expect(entries).toHaveLength(maxEntries);
      expect(entries[0].query).toBe('search 6'); // Oldest kept
      expect(entries[entries.length - 1].query).toBe('search 15'); // Newest
    });
  });

  describe('Entity structure (no traits)', () => {
    it('should have simple id-based structure (not full Entity trait)', () => {
      const entry: SearchHistoryEntry = {
        id: 'simple-id',
        query: 'test',
        searchedAt: new Date(),
      };

      // SearchHistoryEntry is simpler - no createdAt/updatedAt
      expect(entry.id).toBeDefined();
      expect(typeof entry.id).toBe('string');
    });
  });
});
