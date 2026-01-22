import type { CreateListInput } from '@domain/list';
import { toCreateListRow, toDomainList, toUpdateListRow } from '@data/mappers/list.mapper';
import type { ListRow } from '@data/persistence';

describe('List Mapper', () => {
  describe('toDomainList', () => {
    it('should convert SQLite row to domain entity', () => {
      const row: ListRow = {
        id: 'uuid-123',
        name: 'Groceries',
        description: 'Shopping list',
        list_type: 'shopping',
        is_prefabricated: 0,
        created_at: 1704067200000, // 2024-01-01
        updated_at: 1704153600000, // 2024-01-02
      };

      const list = toDomainList(row);

      expect(list.id).toBe('uuid-123');
      expect(list.name).toBe('Groceries');
      expect(list.description).toBe('Shopping list');
      expect(list.listType).toBe('shopping');
      expect(list.isPrefabricated).toBe(false);
      expect(list.createdAt).toBeInstanceOf(Date);
      expect(list.updatedAt).toBeInstanceOf(Date);
    });

    it('should convert is_prefabricated 1 to true', () => {
      const row: ListRow = {
        id: 'prefab-notes',
        name: 'Notas',
        description: null,
        list_type: 'notes',
        is_prefabricated: 1,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const list = toDomainList(row);

      expect(list.isPrefabricated).toBe(true);
    });

    it('should convert null description to undefined', () => {
      const row: ListRow = {
        id: 'uuid-1',
        name: 'Test',
        description: null,
        list_type: 'shopping',
        is_prefabricated: 0,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const list = toDomainList(row);

      expect(list.description).toBeUndefined();
    });

    it('should handle all list types', () => {
      const listTypes = ['notes', 'shopping', 'movies', 'books', 'games'] as const;

      listTypes.forEach((listType) => {
        const row: ListRow = {
          id: `uuid-${listType}`,
          name: `List ${listType}`,
          description: null,
          list_type: listType,
          is_prefabricated: listType === 'notes' ? 1 : 0,
          created_at: Date.now(),
          updated_at: Date.now(),
        };

        const list = toDomainList(row);
        expect(list.listType).toBe(listType);
      });
    });
  });

  describe('toCreateListRow', () => {
    it('should convert domain input to SQLite row', () => {
      const input: CreateListInput = {
        name: 'Groceries',
        description: 'Weekly shopping',
        listType: 'shopping',
        isPrefabricated: false,
      };
      const id = 'generated-uuid';

      const row = toCreateListRow(input, id);

      expect(row.id).toBe('generated-uuid');
      expect(row.name).toBe('Groceries');
      expect(row.description).toBe('Weekly shopping');
      expect(row.list_type).toBe('shopping');
      expect(row.is_prefabricated).toBe(0);
      expect(typeof row.created_at).toBe('number');
      expect(typeof row.updated_at).toBe('number');
    });

    it('should convert isPrefabricated true to 1', () => {
      const input: CreateListInput = {
        name: 'Notas',
        listType: 'notes',
        isPrefabricated: true,
      };

      const row = toCreateListRow(input, 'uuid');

      expect(row.is_prefabricated).toBe(1);
    });

    it('should convert undefined description to null', () => {
      const input: CreateListInput = {
        name: 'Test',
        listType: 'shopping',
        isPrefabricated: false,
      };

      const row = toCreateListRow(input, 'uuid');

      expect(row.description).toBeNull();
    });

    it('should set timestamps to current time', () => {
      const before = Date.now();
      const input: CreateListInput = {
        name: 'Test',
        listType: 'shopping',
        isPrefabricated: false,
      };

      const row = toCreateListRow(input, 'uuid');
      const after = Date.now();

      expect(row.created_at).toBeGreaterThanOrEqual(before);
      expect(row.created_at).toBeLessThanOrEqual(after);
      expect(row.updated_at).toBe(row.created_at);
    });
  });

  describe('toUpdateListRow', () => {
    it('should convert partial update input to row', () => {
      const updates = {
        name: 'Updated Name',
        description: 'New description',
      };

      const row = toUpdateListRow(updates);

      expect(row.name).toBe('Updated Name');
      expect(row.description).toBe('New description');
      expect(typeof row.updated_at).toBe('number');
    });

    it('should handle partial updates with only name', () => {
      const updates = { name: 'Only Name' };

      const row = toUpdateListRow(updates);

      expect(row.name).toBe('Only Name');
      expect(row.description).toBeUndefined();
    });

    it('should always set updated_at timestamp', () => {
      const before = Date.now();
      const row = toUpdateListRow({});
      const after = Date.now();

      expect(row.updated_at).toBeGreaterThanOrEqual(before);
      expect(row.updated_at).toBeLessThanOrEqual(after);
    });
  });

  describe('roundtrip conversion', () => {
    it('should maintain data integrity through create and read', () => {
      const input: CreateListInput = {
        name: 'Roundtrip Test',
        description: 'Testing conversion',
        listType: 'movies',
        isPrefabricated: false,
      };
      const id = 'roundtrip-uuid';

      const createRow = toCreateListRow(input, id);

      // Simulate what would come back from DB
      const readRow: ListRow = {
        id: createRow.id,
        name: createRow.name,
        description: createRow.description,
        list_type: createRow.list_type,
        is_prefabricated: createRow.is_prefabricated,
        created_at: createRow.created_at,
        updated_at: createRow.updated_at,
      };

      const list = toDomainList(readRow);

      expect(list.id).toBe(id);
      expect(list.name).toBe(input.name);
      expect(list.description).toBe(input.description);
      expect(list.listType).toBe(input.listType);
      expect(list.isPrefabricated).toBe(input.isPrefabricated);
    });
  });
});
