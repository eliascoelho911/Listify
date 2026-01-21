/**
 * useSearchStore - Zustand store for managing global search functionality
 *
 * Implements search across items and lists with history management.
 * History is limited to 10 entries using FIFO.
 */

import { create, type StoreApi, type UseBoundStore } from 'zustand';

import type { Item, ItemType } from '@domain/item';
import type { List } from '@domain/list';
import type { GlobalSearchRepository, GlobalSearchResultItem } from '@domain/search';
import type { SearchHistoryEntry, SearchHistoryRepository } from '@domain/search-history';

const MAX_HISTORY_ENTRIES = 10;

/**
 * Dependencies required by the search store
 */
export interface SearchStoreDependencies {
  globalSearchRepository: GlobalSearchRepository<Item, List>;
  searchHistoryRepository: SearchHistoryRepository;
}

/**
 * Filter options for search
 */
export interface SearchFilters {
  /** Filter by item type */
  itemTypes?: ItemType[];

  /** Filter by specific list */
  listId?: string;

  /** Search target (items, lists, or all) */
  target: 'items' | 'lists' | 'all';
}

/**
 * Search result with enriched display info
 */
export interface SearchResult {
  /** Unique identifier */
  id: string;

  /** Entity type */
  entityType: 'item' | 'list';

  /** Title to display */
  title: string;

  /** Subtitle (e.g., list name for items, item count for lists) */
  subtitle?: string;

  /** Item type (for items) or list type (for lists) */
  resultType: 'note' | 'shopping' | 'movie' | 'book' | 'game' | 'list';

  /** Timestamp for display */
  timestamp?: Date;

  /** Original entity for navigation */
  entity: Item | List;
}

/**
 * State shape for the search store
 */
export interface SearchStoreState {
  /** Current search query */
  query: string;

  /** Search results */
  results: SearchResult[];

  /** Whether a search is in progress */
  isSearching: boolean;

  /** Search history entries */
  history: SearchHistoryEntry[];

  /** Whether history has been loaded */
  historyLoaded: boolean;

  /** Current filters */
  filters: SearchFilters;

  /** Error message, if any */
  error: string | null;
}

/**
 * Actions available on the search store
 */
export interface SearchStoreActions {
  /**
   * Set the search query (does not execute search)
   */
  setQuery: (query: string) => void;

  /**
   * Execute search with current query and filters
   */
  executeSearch: () => Promise<void>;

  /**
   * Clear search query and results
   */
  clearSearch: () => void;

  /**
   * Set search filters
   */
  setFilters: (filters: Partial<SearchFilters>) => void;

  /**
   * Load search history from database
   */
  loadHistory: () => Promise<void>;

  /**
   * Add entry to search history
   */
  addToHistory: (query: string) => Promise<void>;

  /**
   * Delete a history entry
   */
  deleteHistoryEntry: (id: string) => Promise<void>;

  /**
   * Clear all search history
   */
  clearHistory: () => Promise<void>;

  /**
   * Clear error state
   */
  clearError: () => void;
}

export type SearchStore = SearchStoreState & SearchStoreActions;

/**
 * Type for the created store instance
 */
export type SearchStoreInstance = UseBoundStore<StoreApi<SearchStore>>;

/**
 * Map a search result item to the display format
 */
function mapToSearchResult(result: GlobalSearchResultItem<Item, List>): SearchResult {
  if (result.entityType === 'item') {
    const item = result.entity;
    return {
      id: item.id,
      entityType: 'item',
      title: item.title,
      subtitle: item.listId ? undefined : 'Inbox', // Will be enriched by caller
      resultType: item.type,
      timestamp: item.createdAt,
      entity: item,
    };
  } else {
    const list = result.entity;
    return {
      id: list.id,
      entityType: 'list',
      title: list.name,
      subtitle: list.description,
      resultType: 'list',
      timestamp: list.createdAt,
      entity: list,
    };
  }
}

/**
 * Create the search store factory
 *
 * @param deps - Repository dependencies
 * @returns A configured Zustand store
 */
export function createSearchStore(deps: SearchStoreDependencies): SearchStoreInstance {
  const { globalSearchRepository, searchHistoryRepository } = deps;

  return create<SearchStore>((set, get) => ({
    // Initial state
    query: '',
    results: [],
    isSearching: false,
    history: [],
    historyLoaded: false,
    filters: {
      target: 'all',
    },
    error: null,

    // Set search query
    setQuery: (query: string): void => {
      set({ query });
    },

    // Execute search
    executeSearch: async (): Promise<void> => {
      const { query, filters } = get();
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        set({ results: [], isSearching: false });
        return;
      }

      set({ isSearching: true, error: null });

      try {
        const searchResult = await globalSearchRepository.search({
          query: trimmedQuery,
          target: filters.target,
          listId: filters.listId,
        });

        const results = searchResult.items.map(mapToSearchResult);

        set({ results, isSearching: false });
        console.debug(`[useSearchStore] Found ${results.length} results for: "${trimmedQuery}"`);
      } catch (error) {
        set({ isSearching: false, error: 'Failed to execute search' });
        console.error('[useSearchStore] Search failed:', error);
      }
    },

    // Clear search
    clearSearch: (): void => {
      set({ query: '', results: [] });
    },

    // Set filters
    setFilters: (newFilters: Partial<SearchFilters>): void => {
      const currentFilters = get().filters;
      set({ filters: { ...currentFilters, ...newFilters } });
    },

    // Load history
    loadHistory: async (): Promise<void> => {
      try {
        const history = await searchHistoryRepository.getRecent(MAX_HISTORY_ENTRIES);
        set({ history, historyLoaded: true });
        console.debug(`[useSearchStore] Loaded ${history.length} history entries`);
      } catch (error) {
        console.error('[useSearchStore] Failed to load history:', error);
      }
    },

    // Add to history
    addToHistory: async (query: string): Promise<void> => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      try {
        const newEntry = await searchHistoryRepository.create({
          query: trimmedQuery,
          searchedAt: new Date(),
        });

        // Update local state with FIFO enforcement
        const currentHistory = get().history;
        const updatedHistory = [
          newEntry,
          ...currentHistory.filter((h) => h.query !== trimmedQuery),
        ].slice(0, MAX_HISTORY_ENTRIES);

        set({ history: updatedHistory });
        console.debug('[useSearchStore] Added to history:', trimmedQuery);
      } catch (error) {
        console.error('[useSearchStore] Failed to add to history:', error);
      }
    },

    // Delete history entry
    deleteHistoryEntry: async (id: string): Promise<void> => {
      const backup = get().history;

      // Optimistic update
      set({ history: backup.filter((h) => h.id !== id) });

      try {
        await searchHistoryRepository.delete(id);
        console.debug('[useSearchStore] Deleted history entry:', id);
      } catch (error) {
        // Rollback
        set({ history: backup });
        console.error('[useSearchStore] Failed to delete history entry:', error);
      }
    },

    // Clear all history
    clearHistory: async (): Promise<void> => {
      const backup = get().history;

      // Optimistic update
      set({ history: [] });

      try {
        await searchHistoryRepository.clearAll();
        console.debug('[useSearchStore] Cleared all history');
      } catch (error) {
        // Rollback
        set({ history: backup });
        console.error('[useSearchStore] Failed to clear history:', error);
      }
    },

    // Clear error
    clearError: (): void => {
      set({ error: null });
    },
  }));
}
