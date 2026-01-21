/**
 * useListStore - Zustand store for managing lists
 *
 * Implements optimistic updates with rollback on error.
 * Handles CRUD operations for all list types (notes, shopping, movies, books, games).
 */

import { create, type StoreApi, type UseBoundStore } from 'zustand';

import type { CreateListInput, List, ListType, UpdateListInput } from '@domain/list';
import type { ListRepository } from '@domain/list/ports/list.repository';

/**
 * Dependencies required by the list store
 */
export interface ListStoreDependencies {
  listRepository: ListRepository;
}

/**
 * State shape for the list store
 */
export interface ListStoreState {
  /** All lists loaded in memory */
  lists: List[];

  /** Whether a loading operation is in progress */
  isLoading: boolean;

  /** Current error message, if any */
  error: string | null;

  /** Whether the store has been initialized */
  initialized: boolean;

  /** Item counts per list (keyed by list ID) */
  itemCounts: Record<string, number>;

  /** Expansion state for category dropdowns (keyed by category) */
  expandedCategories: Record<ListType, boolean>;
}

/**
 * Actions available on the list store
 */
export interface ListStoreActions {
  /**
   * Load all lists
   */
  loadLists: () => Promise<void>;

  /**
   * Create a new list with optimistic update
   * @param input - The list input
   * @returns The created list, or null on failure
   */
  createList: (input: CreateListInput) => Promise<List | null>;

  /**
   * Update an existing list with optimistic update
   * @param id - The list ID
   * @param updates - The updates to apply
   * @returns The updated list, or null on failure
   */
  updateList: (id: string, updates: UpdateListInput) => Promise<List | null>;

  /**
   * Delete a list with optimistic update
   * @param id - The list ID
   * @returns True if deleted successfully
   */
  deleteList: (id: string) => Promise<boolean>;

  /**
   * Get lists by category
   * @param category - The list type category
   * @returns Filtered lists
   */
  getListsByCategory: (category: ListType) => List[];

  /**
   * Toggle category expansion state
   * @param category - The category to toggle
   */
  toggleCategory: (category: ListType) => void;

  /**
   * Set item count for a list
   * @param listId - The list ID
   * @param count - The item count
   */
  setItemCount: (listId: string, count: number) => void;

  /**
   * Clear all lists from the store
   */
  clearLists: () => void;

  /**
   * Clear any error state
   */
  clearError: () => void;
}

export type ListStore = ListStoreState & ListStoreActions;

/**
 * Type for the created store instance
 */
export type ListStoreInstance = UseBoundStore<StoreApi<ListStore>>;

/**
 * Generate a temporary ID for optimistic updates
 */
function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Create an optimistic list from input
 */
function createOptimisticList(input: CreateListInput, tempId: string): List {
  const now = new Date();
  return {
    id: tempId,
    name: input.name,
    description: input.description,
    listType: input.listType,
    isPrefabricated: input.isPrefabricated,
    createdAt: now,
    updatedAt: now,
  } as List;
}

/**
 * Initial expansion state - all categories expanded by default
 */
const DEFAULT_EXPANDED_CATEGORIES: Record<ListType, boolean> = {
  notes: true,
  shopping: true,
  movies: true,
  books: true,
  games: true,
};

/**
 * Create the list store factory
 *
 * @param deps - Repository dependencies
 * @returns A configured Zustand store
 */
export function createListStore(deps: ListStoreDependencies): ListStoreInstance {
  const { listRepository } = deps;

  return create<ListStore>((set, get) => ({
    // Initial state
    lists: [],
    isLoading: false,
    error: null,
    initialized: false,
    itemCounts: {},
    expandedCategories: { ...DEFAULT_EXPANDED_CATEGORIES },

    // Load all lists
    loadLists: async (): Promise<void> => {
      set({ isLoading: true, error: null });

      try {
        const result = await listRepository.getAll({
          field: 'updatedAt',
          direction: 'desc',
        });

        set({
          lists: result.items,
          isLoading: false,
          initialized: true,
        });

        console.debug(`[useListStore] Loaded ${result.items.length} lists`);
      } catch (error) {
        set({ isLoading: false, error: 'Failed to load lists' });
        console.error('[useListStore] Failed to load lists:', error);
      }
    },

    // Create list with optimistic update
    createList: async (input: CreateListInput): Promise<List | null> => {
      const tempId = generateTempId();
      const optimisticList = createOptimisticList(input, tempId);

      // Backup current state for rollback
      const backup = get().lists;

      // Optimistic update - add list immediately
      set({ lists: [...backup, optimisticList], error: null });

      try {
        const created = await listRepository.create(input);

        // Replace optimistic list with real list
        set({
          lists: get().lists.map((list) => (list.id === tempId ? created : list)),
        });

        console.debug('[useListStore] Created list:', created.id);
        return created;
      } catch (error) {
        // Rollback on error
        set({ lists: backup, error: 'Failed to create list' });
        console.error('[useListStore] Failed to create list:', error);
        return null;
      }
    },

    // Update list with optimistic update
    updateList: async (id: string, updates: UpdateListInput): Promise<List | null> => {
      const backup = get().lists;
      const existingIndex = backup.findIndex((list) => list.id === id);

      if (existingIndex === -1) {
        return null;
      }

      const existingList = backup[existingIndex];

      // Optimistic update - apply changes immediately
      const optimisticList = {
        ...existingList,
        ...updates,
        updatedAt: new Date(),
      } as List;
      const newLists = [...backup];
      newLists[existingIndex] = optimisticList;
      set({ lists: newLists, error: null });

      try {
        const updated = await listRepository.update(id, updates);

        if (!updated) {
          // List not found in DB - rollback
          set({ lists: backup, error: 'List not found' });
          return null;
        }

        // Replace with actual updated list
        set({
          lists: get().lists.map((list) => (list.id === id ? updated : list)),
        });

        console.debug('[useListStore] Updated list:', id);
        return updated;
      } catch (error) {
        // Rollback on error
        set({ lists: backup, error: 'Failed to update list' });
        console.error('[useListStore] Failed to update list:', error);
        return null;
      }
    },

    // Delete list with optimistic update
    deleteList: async (id: string): Promise<boolean> => {
      const backup = get().lists;
      const itemCountsBackup = get().itemCounts;

      // Optimistic update - remove list immediately
      set({
        lists: backup.filter((list) => list.id !== id),
        itemCounts: Object.fromEntries(
          Object.entries(itemCountsBackup).filter(([key]) => key !== id),
        ),
        error: null,
      });

      try {
        const success = await listRepository.delete(id);

        if (!success) {
          // Delete failed - rollback
          set({
            lists: backup,
            itemCounts: itemCountsBackup,
            error: 'Failed to delete list',
          });
          return false;
        }

        console.debug('[useListStore] Deleted list:', id);
        return true;
      } catch (error) {
        // Rollback on error
        set({
          lists: backup,
          itemCounts: itemCountsBackup,
          error: 'Failed to delete list',
        });
        console.error('[useListStore] Failed to delete list:', error);
        return false;
      }
    },

    // Get lists by category
    getListsByCategory: (category: ListType): List[] => {
      return get().lists.filter((list) => list.listType === category);
    },

    // Toggle category expansion
    toggleCategory: (category: ListType): void => {
      set({
        expandedCategories: {
          ...get().expandedCategories,
          [category]: !get().expandedCategories[category],
        },
      });
    },

    // Set item count for a list
    setItemCount: (listId: string, count: number): void => {
      set({
        itemCounts: {
          ...get().itemCounts,
          [listId]: count,
        },
      });
    },

    // Clear all lists
    clearLists: (): void => {
      set({
        lists: [],
        initialized: false,
        itemCounts: {},
        expandedCategories: { ...DEFAULT_EXPANDED_CATEGORIES },
      });
    },

    // Clear error state
    clearError: (): void => {
      set({ error: null });
    },
  }));
}
