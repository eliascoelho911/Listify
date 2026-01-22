/**
 * usePurchaseHistoryStore - Zustand store for managing purchase history
 *
 * Implements optimistic updates with rollback on error.
 * Handles creation and retrieval of purchase history records.
 */

import { create, type StoreApi, type UseBoundStore } from 'zustand';

import type {
  CreatePurchaseHistoryInput,
  PurchaseHistory,
} from '@domain/purchase-history/entities/purchase-history.entity';
import type { PurchaseHistoryRepository } from '@domain/purchase-history/ports/purchase-history.repository';

/**
 * Dependencies required by the purchase history store
 */
export interface PurchaseHistoryStoreDependencies {
  purchaseHistoryRepository: PurchaseHistoryRepository;
}

/**
 * State shape for the purchase history store
 */
export interface PurchaseHistoryStoreState {
  /** All purchase history entries loaded in memory */
  entries: PurchaseHistory[];

  /** Whether a loading operation is in progress */
  isLoading: boolean;

  /** Current error message, if any */
  error: string | null;

  /** Whether the store has been initialized */
  initialized: boolean;
}

/**
 * Actions available on the purchase history store
 */
export interface PurchaseHistoryStoreActions {
  /**
   * Create a new purchase history entry with optimistic update
   * @param input - The purchase history input
   * @returns The created entry, or null on failure
   */
  createEntry: (input: CreatePurchaseHistoryInput) => Promise<PurchaseHistory | null>;

  /**
   * Delete a purchase history entry with optimistic update
   * @param id - The entry ID
   * @returns True if deleted successfully
   */
  deleteEntry: (id: string) => Promise<boolean>;

  /**
   * Load purchase history entries by list ID
   * @param listId - The list ID to load history for
   */
  loadByListId: (listId: string) => Promise<void>;

  /**
   * Get an entry by ID
   * @param id - The entry ID
   * @returns The entry, or null if not found
   */
  getById: (id: string) => Promise<PurchaseHistory | null>;

  /**
   * Clear all entries from the store
   */
  clearEntries: () => void;

  /**
   * Clear any error state
   */
  clearError: () => void;
}

export type PurchaseHistoryStore = PurchaseHistoryStoreState & PurchaseHistoryStoreActions;

/**
 * Type for the created store instance
 */
export type PurchaseHistoryStoreInstance = UseBoundStore<StoreApi<PurchaseHistoryStore>>;

/**
 * Generate a temporary ID for optimistic updates
 */
function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Create an optimistic purchase history entry from input
 */
function createOptimisticEntry(input: CreatePurchaseHistoryInput, tempId: string): PurchaseHistory {
  const now = new Date();
  return {
    id: tempId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create the purchase history store factory
 *
 * @param deps - Repository dependencies
 * @returns A configured Zustand store
 */
export function createPurchaseHistoryStore(
  deps: PurchaseHistoryStoreDependencies,
): PurchaseHistoryStoreInstance {
  const { purchaseHistoryRepository } = deps;

  return create<PurchaseHistoryStore>((set, get) => ({
    // Initial state
    entries: [],
    isLoading: false,
    error: null,
    initialized: false,

    // Create entry with optimistic update
    createEntry: async (input: CreatePurchaseHistoryInput): Promise<PurchaseHistory | null> => {
      const tempId = generateTempId();
      const optimisticEntry = createOptimisticEntry(input, tempId);

      // Backup current state for rollback
      const backup = get().entries;

      // Optimistic update - add entry immediately (newest first)
      set({ entries: [optimisticEntry, ...backup], error: null });

      try {
        const created = await purchaseHistoryRepository.create(input);

        // Replace optimistic entry with real entry
        set({
          entries: get().entries.map((entry) => (entry.id === tempId ? created : entry)),
        });

        console.debug('[usePurchaseHistoryStore] Created entry:', created.id);
        return created;
      } catch (error) {
        // Rollback on error
        set({ entries: backup, error: 'Failed to create purchase history entry' });
        console.error('[usePurchaseHistoryStore] Failed to create entry:', error);
        return null;
      }
    },

    // Delete entry with optimistic update
    deleteEntry: async (id: string): Promise<boolean> => {
      const backup = get().entries;

      // Optimistic update - remove entry immediately
      set({ entries: backup.filter((entry) => entry.id !== id), error: null });

      try {
        const success = await purchaseHistoryRepository.delete(id);

        if (!success) {
          // Delete failed - rollback
          set({ entries: backup, error: 'Failed to delete purchase history entry' });
          return false;
        }

        console.debug('[usePurchaseHistoryStore] Deleted entry:', id);
        return true;
      } catch (error) {
        // Rollback on error
        set({ entries: backup, error: 'Failed to delete purchase history entry' });
        console.error('[usePurchaseHistoryStore] Failed to delete entry:', error);
        return false;
      }
    },

    // Load entries by list ID
    loadByListId: async (listId: string): Promise<void> => {
      set({ isLoading: true, error: null });

      try {
        const entries = await purchaseHistoryRepository.getByListId(listId);

        // Sort by purchaseDate descending (newest first)
        entries.sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime());

        set({ entries, isLoading: false, initialized: true });
        console.debug(
          `[usePurchaseHistoryStore] Loaded ${entries.length} entries for list:`,
          listId,
        );
      } catch (error) {
        set({ isLoading: false, error: 'Failed to load purchase history' });
        console.error('[usePurchaseHistoryStore] Failed to load entries:', error);
      }
    },

    // Get entry by ID
    getById: async (id: string): Promise<PurchaseHistory | null> => {
      try {
        const entry = await purchaseHistoryRepository.getById(id);
        return entry;
      } catch (error) {
        console.error('[usePurchaseHistoryStore] Failed to get entry:', error);
        return null;
      }
    },

    // Clear all entries
    clearEntries: (): void => {
      set({ entries: [], initialized: false });
    },

    // Clear error state
    clearError: (): void => {
      set({ error: null });
    },
  }));
}
