/**
 * useUserPreferencesStore - Zustand store for managing user preferences
 *
 * Implements optimistic updates with rollback on error.
 * Handles theme, primary color, and layout configurations.
 */

import { create, type StoreApi, type UseBoundStore } from 'zustand';

import type { LayoutConfig } from '@domain/common';
import type { ItemGroupCriteria } from '@domain/item';
import type {
  LayoutConfigs,
  SpecialLayoutKey,
  Theme,
  UpdateUserPreferencesInput,
  UserPreferences,
} from '@domain/user/entities/user-preferences.entity';
import type { UserPreferencesRepository } from '@domain/user/ports/user-preferences.repository';

/**
 * Dependencies required by the user preferences store
 */
export interface UserPreferencesStoreDependencies {
  userPreferencesRepository: UserPreferencesRepository;
}

/**
 * Default layout configuration for notes screen
 */
const DEFAULT_NOTES_LAYOUT: LayoutConfig<ItemGroupCriteria> = {
  groupBy: 'createdAt',
  sortDirection: 'desc',
};

/**
 * Default layout configuration for inbox screen
 */
const DEFAULT_INBOX_LAYOUT: LayoutConfig<ItemGroupCriteria> = {
  groupBy: 'createdAt',
  sortDirection: 'desc',
};

/**
 * State shape for the user preferences store
 */
export interface UserPreferencesStoreState {
  /** Current user preferences */
  preferences: UserPreferences | null;

  /** Whether a loading operation is in progress */
  isLoading: boolean;

  /** Current error message, if any */
  error: string | null;

  /** Whether the store has been initialized */
  initialized: boolean;
}

/**
 * Actions available on the user preferences store
 */
export interface UserPreferencesStoreActions {
  /**
   * Load user preferences by user ID
   * @param userId - The user ID
   */
  loadPreferences: (userId: string) => Promise<void>;

  /**
   * Update theme with optimistic update
   * @param theme - The new theme
   */
  setTheme: (theme: Theme) => Promise<void>;

  /**
   * Update primary color with optimistic update
   * @param color - The new primary color (hex)
   */
  setPrimaryColor: (color: string | undefined) => Promise<void>;

  /**
   * Get layout config for a specific screen/list
   * @param key - The layout key (listId, 'inbox', or 'notes')
   * @returns The layout config
   */
  getLayoutConfig: (key: string | SpecialLayoutKey) => LayoutConfig<ItemGroupCriteria>;

  /**
   * Update layout config for a specific screen/list
   * @param key - The layout key (listId, 'inbox', or 'notes')
   * @param config - The new layout config
   */
  setLayoutConfig: (
    key: string | SpecialLayoutKey,
    config: LayoutConfig<ItemGroupCriteria>,
  ) => Promise<void>;

  /**
   * Update multiple preferences at once
   * @param updates - The updates to apply
   */
  updatePreferences: (updates: UpdateUserPreferencesInput) => Promise<void>;

  /**
   * Clear any error state
   */
  clearError: () => void;

  /**
   * Reset store to initial state
   */
  reset: () => void;
}

export type UserPreferencesStore = UserPreferencesStoreState & UserPreferencesStoreActions;

/**
 * Type for the created store instance
 */
export type UserPreferencesStoreInstance = UseBoundStore<StoreApi<UserPreferencesStore>>;

/**
 * Create the user preferences store factory
 *
 * @param deps - Repository dependencies
 * @returns A configured Zustand store
 */
export function createUserPreferencesStore(
  deps: UserPreferencesStoreDependencies,
): UserPreferencesStoreInstance {
  const { userPreferencesRepository } = deps;

  return create<UserPreferencesStore>((set, get) => ({
    // Initial state
    preferences: null,
    isLoading: false,
    error: null,
    initialized: false,

    // Load preferences by user ID
    loadPreferences: async (userId: string): Promise<void> => {
      set({ isLoading: true, error: null });

      try {
        const preferences = await userPreferencesRepository.getByUserId(userId);

        set({
          preferences,
          isLoading: false,
          initialized: true,
        });

        console.debug('[useUserPreferencesStore] Loaded preferences for user:', userId);
      } catch (error) {
        set({ isLoading: false, error: 'Failed to load preferences' });
        console.error('[useUserPreferencesStore] Failed to load preferences:', error);
      }
    },

    // Set theme with optimistic update
    setTheme: async (theme: Theme): Promise<void> => {
      const current = get().preferences;
      if (!current) {
        console.error('[useUserPreferencesStore] Cannot set theme: preferences not loaded');
        return;
      }

      // Backup for rollback
      const backup = current;

      // Optimistic update
      set({
        preferences: { ...current, theme, updatedAt: new Date() },
        error: null,
      });

      try {
        const updated = await userPreferencesRepository.update(current.id, { theme });

        if (updated) {
          set({ preferences: updated });
          console.debug('[useUserPreferencesStore] Theme updated to:', theme);
        } else {
          throw new Error('Update returned null');
        }
      } catch (error) {
        // Rollback
        set({ preferences: backup, error: 'Failed to update theme' });
        console.error('[useUserPreferencesStore] Failed to update theme:', error);
      }
    },

    // Set primary color with optimistic update
    setPrimaryColor: async (color: string | undefined): Promise<void> => {
      const current = get().preferences;
      if (!current) {
        console.error('[useUserPreferencesStore] Cannot set primary color: preferences not loaded');
        return;
      }

      // Backup for rollback
      const backup = current;

      // Optimistic update
      set({
        preferences: { ...current, primaryColor: color, updatedAt: new Date() },
        error: null,
      });

      try {
        const updated = await userPreferencesRepository.update(current.id, { primaryColor: color });

        if (updated) {
          set({ preferences: updated });
          console.debug('[useUserPreferencesStore] Primary color updated to:', color);
        } else {
          throw new Error('Update returned null');
        }
      } catch (error) {
        // Rollback
        set({ preferences: backup, error: 'Failed to update primary color' });
        console.error('[useUserPreferencesStore] Failed to update primary color:', error);
      }
    },

    // Get layout config with defaults
    getLayoutConfig: (key: string | SpecialLayoutKey): LayoutConfig<ItemGroupCriteria> => {
      const current = get().preferences;

      // Return from stored configs if available
      if (current?.layoutConfigs[key]) {
        return current.layoutConfigs[key];
      }

      // Return appropriate default
      if (key === 'notes') {
        return DEFAULT_NOTES_LAYOUT;
      }
      if (key === 'inbox') {
        return DEFAULT_INBOX_LAYOUT;
      }

      // Default for custom lists
      return DEFAULT_NOTES_LAYOUT;
    },

    // Set layout config with optimistic update
    setLayoutConfig: async (
      key: string | SpecialLayoutKey,
      config: LayoutConfig<ItemGroupCriteria>,
    ): Promise<void> => {
      const current = get().preferences;
      if (!current) {
        console.error('[useUserPreferencesStore] Cannot set layout: preferences not loaded');
        return;
      }

      // Backup for rollback
      const backup = current;

      // Build new layout configs
      const newLayoutConfigs: LayoutConfigs = {
        ...current.layoutConfigs,
        [key]: config,
      };

      // Optimistic update
      set({
        preferences: { ...current, layoutConfigs: newLayoutConfigs, updatedAt: new Date() },
        error: null,
      });

      try {
        const updated = await userPreferencesRepository.update(current.id, {
          layoutConfigs: newLayoutConfigs,
        });

        if (updated) {
          set({ preferences: updated });
          console.debug('[useUserPreferencesStore] Layout config updated for:', key);
        } else {
          throw new Error('Update returned null');
        }
      } catch (error) {
        // Rollback
        set({ preferences: backup, error: 'Failed to update layout config' });
        console.error('[useUserPreferencesStore] Failed to update layout config:', error);
      }
    },

    // Update multiple preferences at once
    updatePreferences: async (updates: UpdateUserPreferencesInput): Promise<void> => {
      const current = get().preferences;
      if (!current) {
        console.error('[useUserPreferencesStore] Cannot update: preferences not loaded');
        return;
      }

      // Backup for rollback
      const backup = current;

      // Optimistic update
      set({
        preferences: { ...current, ...updates, updatedAt: new Date() },
        error: null,
      });

      try {
        const updated = await userPreferencesRepository.update(current.id, updates);

        if (updated) {
          set({ preferences: updated });
          console.debug('[useUserPreferencesStore] Preferences updated');
        } else {
          throw new Error('Update returned null');
        }
      } catch (error) {
        // Rollback
        set({ preferences: backup, error: 'Failed to update preferences' });
        console.error('[useUserPreferencesStore] Failed to update preferences:', error);
      }
    },

    // Clear error state
    clearError: (): void => {
      set({ error: null });
    },

    // Reset store
    reset: (): void => {
      set({
        preferences: null,
        isLoading: false,
        error: null,
        initialized: false,
      });
    },
  }));
}
