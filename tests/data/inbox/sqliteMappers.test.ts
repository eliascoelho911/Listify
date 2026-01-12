import type { Tag, UserInput } from '@domain/inbox/entities';
import {
  mapTagEntityToRow,
  mapTagRowToEntity,
  mapUserInputEntityToRow,
  mapUserInputRowToEntity,
} from '@data/inbox/mappers/sqliteMappers';
import type { TagRow, UserInputRow } from '@data/inbox/mappers/types';

describe('sqliteMappers', () => {
  describe('mapUserInputRowToEntity', () => {
    it('should map a UserInputRow to UserInput entity', () => {
      const row: UserInputRow = {
        id: 'input-123',
        text: 'Buy milk #compras',
        created_at: '2024-01-15T10:30:00.000Z',
        updated_at: '2024-01-15T11:00:00.000Z',
      };
      const tags: Tag[] = [
        {
          id: 'tag-1',
          name: 'compras',
          usageCount: 5,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
        },
      ];

      const result = mapUserInputRowToEntity(row, tags);

      expect(result.id).toBe('input-123');
      expect(result.text).toBe('Buy milk #compras');
      expect(result.createdAt).toEqual(new Date('2024-01-15T10:30:00.000Z'));
      expect(result.updatedAt).toEqual(new Date('2024-01-15T11:00:00.000Z'));
      expect(result.tags).toHaveLength(1);
      expect(result.tags[0].name).toBe('compras');
    });

    it('should handle empty tags array', () => {
      const row: UserInputRow = {
        id: 'input-456',
        text: 'Simple text without tags',
        created_at: '2024-01-15T10:30:00.000Z',
        updated_at: '2024-01-15T10:30:00.000Z',
      };

      const result = mapUserInputRowToEntity(row, []);

      expect(result.id).toBe('input-456');
      expect(result.tags).toHaveLength(0);
    });
  });

  describe('mapUserInputEntityToRow', () => {
    it('should map a UserInput entity to UserInputRow', () => {
      const input: UserInput = {
        id: 'input-789',
        text: 'Test input',
        createdAt: new Date('2024-01-15T10:30:00.000Z'),
        updatedAt: new Date('2024-01-15T11:00:00.000Z'),
        tags: [],
      };

      const result = mapUserInputEntityToRow(input);

      expect(result.id).toBe('input-789');
      expect(result.text).toBe('Test input');
      expect(result.created_at).toBe('2024-01-15T10:30:00.000Z');
      expect(result.updated_at).toBe('2024-01-15T11:00:00.000Z');
    });

    it('should correctly format dates to ISO strings', () => {
      const date = new Date(2024, 5, 15, 14, 30, 0); // June 15, 2024
      const input: UserInput = {
        id: 'input-test',
        text: 'Test',
        createdAt: date,
        updatedAt: date,
        tags: [],
      };

      const result = mapUserInputEntityToRow(input);

      expect(result.created_at).toBe(date.toISOString());
      expect(result.updated_at).toBe(date.toISOString());
    });
  });

  describe('mapTagRowToEntity', () => {
    it('should map a TagRow to Tag entity', () => {
      const row: TagRow = {
        id: 'tag-123',
        name: 'compras',
        usage_count: 10,
        created_at: '2024-01-01T00:00:00.000Z',
      };

      const result = mapTagRowToEntity(row);

      expect(result.id).toBe('tag-123');
      expect(result.name).toBe('compras');
      expect(result.usageCount).toBe(10);
      expect(result.createdAt).toEqual(new Date('2024-01-01T00:00:00.000Z'));
    });
  });

  describe('mapTagEntityToRow', () => {
    it('should map a Tag entity to TagRow', () => {
      const tag: Tag = {
        id: 'tag-456',
        name: 'mercado',
        usageCount: 3,
        createdAt: new Date('2024-02-01T08:00:00.000Z'),
      };

      const result = mapTagEntityToRow(tag);

      expect(result.id).toBe('tag-456');
      expect(result.name).toBe('mercado');
      expect(result.usage_count).toBe(3);
      expect(result.created_at).toBe('2024-02-01T08:00:00.000Z');
    });
  });

  describe('round-trip conversions', () => {
    it('should preserve UserInput data through entity -> row -> entity conversion', () => {
      const originalInput: UserInput = {
        id: 'round-trip-input',
        text: 'Round trip test #teste',
        createdAt: new Date('2024-03-15T12:00:00.000Z'),
        updatedAt: new Date('2024-03-15T13:00:00.000Z'),
        tags: [],
      };

      const row = mapUserInputEntityToRow(originalInput);
      const restoredInput = mapUserInputRowToEntity(row, []);

      expect(restoredInput.id).toBe(originalInput.id);
      expect(restoredInput.text).toBe(originalInput.text);
      expect(restoredInput.createdAt.toISOString()).toBe(originalInput.createdAt.toISOString());
      expect(restoredInput.updatedAt.toISOString()).toBe(originalInput.updatedAt.toISOString());
    });

    it('should preserve Tag data through entity -> row -> entity conversion', () => {
      const originalTag: Tag = {
        id: 'round-trip-tag',
        name: 'roundtrip',
        usageCount: 7,
        createdAt: new Date('2024-03-01T00:00:00.000Z'),
      };

      const row = mapTagEntityToRow(originalTag);
      const restoredTag = mapTagRowToEntity(row);

      expect(restoredTag.id).toBe(originalTag.id);
      expect(restoredTag.name).toBe(originalTag.name);
      expect(restoredTag.usageCount).toBe(originalTag.usageCount);
      expect(restoredTag.createdAt.toISOString()).toBe(originalTag.createdAt.toISOString());
    });
  });
});
