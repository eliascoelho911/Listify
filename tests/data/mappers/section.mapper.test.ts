import type { CreateSectionInput, Section } from '@domain/section';
import {
  toCreateSectionRow,
  toDomainSection,
  toUpdateSectionRow,
} from '@data/mappers/section.mapper';
import type { CreateSectionRow, SectionRow, UpdateSectionRow } from '@data/persistence';

describe('Section Mapper', () => {
  describe('toDomainSection', () => {
    it('should convert SQLite row to domain entity', () => {
      const row: SectionRow = {
        id: 'uuid-123',
        list_id: 'list-uuid',
        name: 'Padaria',
        sort_order: 0,
        created_at: 1704067200000, // 2024-01-01
        updated_at: 1704153600000, // 2024-01-02
      };

      const section = toDomainSection(row);

      expect(section.id).toBe('uuid-123');
      expect(section.listId).toBe('list-uuid');
      expect(section.name).toBe('Padaria');
      expect(section.sortOrder).toBe(0);
      expect(section.createdAt).toBeInstanceOf(Date);
      expect(section.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle different sort orders', () => {
      const rows: SectionRow[] = [
        {
          id: '1',
          list_id: 'list',
          name: 'First',
          sort_order: 0,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: '2',
          list_id: 'list',
          name: 'Second',
          sort_order: 1,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: '3',
          list_id: 'list',
          name: 'Third',
          sort_order: 2,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      ];

      const sections = rows.map(toDomainSection);

      expect(sections[0].sortOrder).toBe(0);
      expect(sections[1].sortOrder).toBe(1);
      expect(sections[2].sortOrder).toBe(2);
    });
  });

  describe('toCreateSectionRow', () => {
    it('should convert domain input to SQLite row', () => {
      const input: CreateSectionInput = {
        listId: 'list-1',
        name: 'Nova Seção',
        sortOrder: 0,
      };
      const id = 'generated-uuid';

      const row = toCreateSectionRow(input, id);

      expect(row.id).toBe('generated-uuid');
      expect(row.list_id).toBe('list-1');
      expect(row.name).toBe('Nova Seção');
      expect(row.sort_order).toBe(0);
      expect(typeof row.created_at).toBe('number');
      expect(typeof row.updated_at).toBe('number');
    });

    it('should set timestamps to current time', () => {
      const before = Date.now();
      const input: CreateSectionInput = {
        listId: 'list-1',
        name: 'Test',
        sortOrder: 0,
      };

      const row = toCreateSectionRow(input, 'uuid');
      const after = Date.now();

      expect(row.created_at).toBeGreaterThanOrEqual(before);
      expect(row.created_at).toBeLessThanOrEqual(after);
      expect(row.updated_at).toBe(row.created_at);
    });
  });

  describe('toUpdateSectionRow', () => {
    it('should convert partial update input to row', () => {
      const updates = {
        name: 'Updated Section Name',
        sortOrder: 5,
      };

      const row = toUpdateSectionRow(updates);

      expect(row.name).toBe('Updated Section Name');
      expect(row.sort_order).toBe(5);
      expect(typeof row.updated_at).toBe('number');
    });

    it('should handle partial updates with only name', () => {
      const updates = { name: 'Only Name' };

      const row = toUpdateSectionRow(updates);

      expect(row.name).toBe('Only Name');
      expect(row.sort_order).toBeUndefined();
    });

    it('should handle partial updates with only sortOrder', () => {
      const updates = { sortOrder: 10 };

      const row = toUpdateSectionRow(updates);

      expect(row.sort_order).toBe(10);
      expect(row.name).toBeUndefined();
    });

    it('should always set updated_at timestamp', () => {
      const before = Date.now();
      const row = toUpdateSectionRow({});
      const after = Date.now();

      expect(row.updated_at).toBeGreaterThanOrEqual(before);
      expect(row.updated_at).toBeLessThanOrEqual(after);
    });
  });

  describe('roundtrip conversion', () => {
    it('should maintain data integrity through create and read', () => {
      const input: CreateSectionInput = {
        listId: 'list-uuid',
        name: 'Roundtrip Test',
        sortOrder: 3,
      };
      const id = 'roundtrip-uuid';

      const createRow = toCreateSectionRow(input, id);

      // Simulate what would come back from DB
      const readRow: SectionRow = {
        id: createRow.id,
        list_id: createRow.list_id,
        name: createRow.name,
        sort_order: createRow.sort_order,
        created_at: createRow.created_at,
        updated_at: createRow.updated_at,
      };

      const section = toDomainSection(readRow);

      expect(section.id).toBe(id);
      expect(section.listId).toBe(input.listId);
      expect(section.name).toBe(input.name);
      expect(section.sortOrder).toBe(input.sortOrder);
    });
  });
});
