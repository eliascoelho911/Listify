/**
 * useSearchStoreWithDI Hook
 *
 * Provides access to the search store with automatic DI integration.
 * Creates a stable store instance using the repositories from the DI container.
 */

import { useMemo } from 'react';

import { useAppDependencies } from '@app/di';

import { createSearchStore, type SearchStoreInstance } from '../stores/useSearchStore';

/**
 * Hook that creates and returns a search store connected to DI repositories.
 *
 * The store instance is memoized based on the repository references,
 * so it will only be recreated if the DI container changes.
 *
 * @returns The search store instance with all actions and state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const searchStore = useSearchStoreWithDI();
 *
 *   const handleSearch = async () => {
 *     const state = searchStore.getState();
 *     state.setQuery('milk');
 *     await state.executeSearch();
 *   };
 *
 *   // Subscribe to state changes
 *   const results = searchStore(state => state.results);
 * }
 * ```
 */
export function useSearchStoreWithDI(): SearchStoreInstance {
  const { globalSearchRepository, searchHistoryRepository } = useAppDependencies();

  const store = useMemo(
    () =>
      createSearchStore({
        globalSearchRepository,
        searchHistoryRepository,
      }),
    [globalSearchRepository, searchHistoryRepository],
  );

  return store;
}
