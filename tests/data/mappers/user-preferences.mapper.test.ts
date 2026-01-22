import type { CreateUserPreferencesInput, LayoutConfigs } from '@domain/user';
import {
  toCreateUserPreferencesRow,
  toDomainUserPreferences,
  toUpdateUserPreferencesRow,
} from '@data/mappers/user-preferences.mapper';
import type { UserPreferencesRow } from '@data/persistence';

describe('UserPreferences Mapper', () => {
  describe('toDomainUserPreferences', () => {
    it('should convert SQLite row to domain entity', () => {
      const layoutConfigs: LayoutConfigs = {
        inbox: { groupBy: 'createdAt', sortDirection: 'desc' },
      };

      const row: UserPreferencesRow = {
        id: 'uuid-123',
        user_id: 'user-uuid',
        theme: 'dark',
        primary_color: '#06b6d4',
        layout_configs: JSON.stringify(layoutConfigs),
        created_at: 1704067200000,
        updated_at: 1704153600000,
      };

      const prefs = toDomainUserPreferences(row);

      expect(prefs.id).toBe('uuid-123');
      expect(prefs.userId).toBe('user-uuid');
      expect(prefs.theme).toBe('dark');
      expect(prefs.primaryColor).toBe('#06b6d4');
      expect(prefs.layoutConfigs).toEqual(layoutConfigs);
      expect(prefs.createdAt).toBeInstanceOf(Date);
      expect(prefs.updatedAt).toBeInstanceOf(Date);
    });

    it('should convert null primary_color to undefined', () => {
      const row: UserPreferencesRow = {
        id: 'uuid-1',
        user_id: 'user-1',
        theme: 'light',
        primary_color: null,
        layout_configs: '{}',
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const prefs = toDomainUserPreferences(row);

      expect(prefs.primaryColor).toBeUndefined();
    });

    it('should parse layout_configs JSON correctly', () => {
      const configs: LayoutConfigs = {
        'list-1': { groupBy: 'sectionId', sortDirection: 'asc' },
        'list-2': { groupBy: 'listId', sortDirection: 'desc' },
        inbox: { groupBy: 'createdAt', sortDirection: 'desc' },
      };

      const row: UserPreferencesRow = {
        id: 'uuid-1',
        user_id: 'user-1',
        theme: 'auto',
        primary_color: null,
        layout_configs: JSON.stringify(configs),
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const prefs = toDomainUserPreferences(row);

      expect(prefs.layoutConfigs['list-1'].groupBy).toBe('sectionId');
      expect(prefs.layoutConfigs['inbox'].groupBy).toBe('createdAt');
    });

    it('should handle all theme values', () => {
      const themes = ['light', 'dark', 'auto'] as const;

      themes.forEach((theme) => {
        const row: UserPreferencesRow = {
          id: `uuid-${theme}`,
          user_id: 'user-1',
          theme,
          primary_color: null,
          layout_configs: '{}',
          created_at: Date.now(),
          updated_at: Date.now(),
        };

        const prefs = toDomainUserPreferences(row);
        expect(prefs.theme).toBe(theme);
      });
    });
  });

  describe('toCreateUserPreferencesRow', () => {
    it('should convert domain input to SQLite row', () => {
      const layoutConfigs: LayoutConfigs = {
        inbox: { groupBy: 'listId', sortDirection: 'asc' },
      };

      const input: CreateUserPreferencesInput = {
        userId: 'user-1',
        theme: 'dark',
        primaryColor: '#ff0000',
        layoutConfigs,
      };
      const id = 'generated-uuid';

      const row = toCreateUserPreferencesRow(input, id);

      expect(row.id).toBe('generated-uuid');
      expect(row.user_id).toBe('user-1');
      expect(row.theme).toBe('dark');
      expect(row.primary_color).toBe('#ff0000');
      expect(row.layout_configs).toBe(JSON.stringify(layoutConfigs));
      expect(typeof row.created_at).toBe('number');
      expect(typeof row.updated_at).toBe('number');
    });

    it('should convert undefined primaryColor to null', () => {
      const input: CreateUserPreferencesInput = {
        userId: 'user-1',
        theme: 'auto',
        layoutConfigs: {},
      };

      const row = toCreateUserPreferencesRow(input, 'uuid');

      expect(row.primary_color).toBeNull();
    });

    it('should stringify layoutConfigs', () => {
      const input: CreateUserPreferencesInput = {
        userId: 'user-1',
        theme: 'dark',
        layoutConfigs: {
          notes: { groupBy: 'updatedAt', sortDirection: 'asc' },
        },
      };

      const row = toCreateUserPreferencesRow(input, 'uuid');

      expect(typeof row.layout_configs).toBe('string');
      expect(JSON.parse(row.layout_configs)).toEqual(input.layoutConfigs);
    });
  });

  describe('toUpdateUserPreferencesRow', () => {
    it('should convert partial update input to row', () => {
      const updates = {
        theme: 'light' as const,
        primaryColor: '#00ff00',
      };

      const row = toUpdateUserPreferencesRow(updates);

      expect(row.theme).toBe('light');
      expect(row.primary_color).toBe('#00ff00');
      expect(typeof row.updated_at).toBe('number');
    });

    it('should handle layoutConfigs update', () => {
      const newConfigs: LayoutConfigs = {
        inbox: { groupBy: 'listId', sortDirection: 'desc' },
      };

      const updates = { layoutConfigs: newConfigs };

      const row = toUpdateUserPreferencesRow(updates);

      expect(row.layout_configs).toBe(JSON.stringify(newConfigs));
    });

    it('should handle partial updates', () => {
      const updates = { theme: 'auto' as const };

      const row = toUpdateUserPreferencesRow(updates);

      expect(row.theme).toBe('auto');
      expect(row.primary_color).toBeUndefined();
      expect(row.layout_configs).toBeUndefined();
    });

    it('should always set updated_at timestamp', () => {
      const before = Date.now();
      const row = toUpdateUserPreferencesRow({});
      const after = Date.now();

      expect(row.updated_at).toBeGreaterThanOrEqual(before);
      expect(row.updated_at).toBeLessThanOrEqual(after);
    });
  });

  describe('roundtrip conversion', () => {
    it('should maintain data integrity through create and read', () => {
      const layoutConfigs: LayoutConfigs = {
        inbox: { groupBy: 'createdAt', sortDirection: 'desc' },
        notes: { groupBy: 'sectionId', sortDirection: 'asc' },
      };

      const input: CreateUserPreferencesInput = {
        userId: 'user-roundtrip',
        theme: 'dark',
        primaryColor: '#06b6d4',
        layoutConfigs,
      };
      const id = 'roundtrip-uuid';

      const createRow = toCreateUserPreferencesRow(input, id);

      const readRow: UserPreferencesRow = {
        id: createRow.id,
        user_id: createRow.user_id,
        theme: createRow.theme,
        primary_color: createRow.primary_color,
        layout_configs: createRow.layout_configs,
        created_at: createRow.created_at,
        updated_at: createRow.updated_at,
      };

      const prefs = toDomainUserPreferences(readRow);

      expect(prefs.id).toBe(id);
      expect(prefs.userId).toBe(input.userId);
      expect(prefs.theme).toBe(input.theme);
      expect(prefs.primaryColor).toBe(input.primaryColor);
      expect(prefs.layoutConfigs).toEqual(input.layoutConfigs);
    });
  });
});
