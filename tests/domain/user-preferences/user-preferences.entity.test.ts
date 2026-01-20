import type {
  CreateUserPreferencesInput,
  LayoutConfigs,
  Theme,
  UpdateUserPreferencesInput,
  UserPreferences,
} from '@domain/user';

describe('UserPreferences Entity', () => {
  describe('UserPreferences type structure', () => {
    it('should have correct shape', () => {
      const prefs: UserPreferences = {
        id: 'uuid-1',
        userId: 'user-uuid',
        theme: 'dark',
        primaryColor: '#06b6d4',
        layoutConfigs: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(prefs.id).toBe('uuid-1');
      expect(prefs.userId).toBe('user-uuid');
      expect(prefs.theme).toBe('dark');
      expect(prefs.primaryColor).toBe('#06b6d4');
      expect(prefs.layoutConfigs).toEqual({});
    });

    it('should allow optional primaryColor', () => {
      const prefsWithColor: UserPreferences = {
        id: '1',
        userId: 'user-1',
        theme: 'dark',
        primaryColor: '#ff0000',
        layoutConfigs: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(prefsWithColor.primaryColor).toBeDefined();

      const prefsWithoutColor: UserPreferences = {
        id: '2',
        userId: 'user-2',
        theme: 'light',
        layoutConfigs: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(prefsWithoutColor.primaryColor).toBeUndefined();
    });
  });

  describe('Theme type', () => {
    it('should support light, dark, and auto values', () => {
      const themes: Theme[] = ['light', 'dark', 'auto'];

      themes.forEach((theme) => {
        expect(['light', 'dark', 'auto']).toContain(theme);
      });
    });
  });

  describe('LayoutConfigs type', () => {
    it('should support layout config per listId', () => {
      const configs: LayoutConfigs = {
        'list-uuid-1': {
          groupBy: 'sectionId',
          sortDirection: 'asc',
        },
        'list-uuid-2': {
          groupBy: 'listId',
          sortDirection: 'desc',
        },
      };

      expect(configs['list-uuid-1'].groupBy).toBe('sectionId');
      expect(configs['list-uuid-2'].sortDirection).toBe('desc');
    });

    it('should support special layout keys (inbox, notes)', () => {
      const configs: LayoutConfigs = {
        inbox: {
          groupBy: 'createdAt',
          sortDirection: 'desc',
        },
        notes: {
          groupBy: 'updatedAt',
          sortDirection: 'asc',
        },
      };

      expect(configs['inbox'].groupBy).toBe('createdAt');
      expect(configs['notes'].groupBy).toBe('updatedAt');
    });
  });

  describe('CreateUserPreferencesInput type', () => {
    it('should exclude id, createdAt, and updatedAt', () => {
      const input: CreateUserPreferencesInput = {
        userId: 'user-1',
        theme: 'dark',
        layoutConfigs: {},
      };

      expect(input.userId).toBe('user-1');
      expect(input.theme).toBe('dark');
    });

    it('should require userId', () => {
      const input: CreateUserPreferencesInput = {
        userId: 'mandatory-user-id',
        theme: 'auto',
        layoutConfigs: {},
      };

      expect(input.userId).toBeDefined();
    });
  });

  describe('UpdateUserPreferencesInput type', () => {
    it('should make theme, primaryColor, and layoutConfigs optional', () => {
      const fullUpdate: UpdateUserPreferencesInput = {
        theme: 'light',
        primaryColor: '#00ff00',
        layoutConfigs: {
          inbox: { groupBy: 'listId', sortDirection: 'asc' },
        },
      };

      expect(fullUpdate.theme).toBe('light');
      expect(fullUpdate.primaryColor).toBe('#00ff00');

      const partialUpdate: UpdateUserPreferencesInput = {
        theme: 'auto',
      };

      expect(partialUpdate.theme).toBe('auto');
      expect(partialUpdate.primaryColor).toBeUndefined();
    });

    it('should not allow updating userId', () => {
      const update: UpdateUserPreferencesInput = {
        theme: 'dark',
      };

      // @ts-expect-error userId should not be updatable
      expect(update.userId).toBeUndefined();
    });
  });

  describe('Entity traits composition', () => {
    it('should have Entity trait (id)', () => {
      const prefs: UserPreferences = {
        id: 'entity-id',
        userId: 'user-1',
        theme: 'dark',
        layoutConfigs: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(typeof prefs.id).toBe('string');
    });

    it('should have Timestamped trait (createdAt, updatedAt)', () => {
      const now = new Date();
      const prefs: UserPreferences = {
        id: '1',
        userId: 'user-1',
        theme: 'dark',
        layoutConfigs: {},
        createdAt: now,
        updatedAt: now,
      };

      expect(prefs.createdAt).toBeInstanceOf(Date);
      expect(prefs.updatedAt).toBeInstanceOf(Date);
    });
  });
});
