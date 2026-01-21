/**
 * useListStoreWithDI Hook
 *
 * Provides access to the list store with automatic DI integration.
 * Creates a stable store instance using the list repository from the DI container.
 */

import { useMemo } from 'react';

import { useAppDependencies } from '@app/di';

import { createListStore, type ListStoreInstance } from '../stores/useListStore';

/**
 * Hook that creates and returns a list store connected to DI repositories.
 *
 * The store instance is memoized based on the repository references,
 * so it will only be recreated if the DI container changes.
 *
 * @returns The list store instance with all actions and state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const listStore = useListStoreWithDI();
 *
 *   const handleCreate = async () => {
 *     const list = await listStore.getState().createList({
 *       name: 'My List',
 *       listType: 'shopping',
 *       isPrefabricated: false,
 *     });
 *   };
 *
 *   // Subscribe to state changes
 *   const lists = listStore(state => state.lists);
 * }
 * ```
 */
export function useListStoreWithDI(): ListStoreInstance {
  const { listRepository } = useAppDependencies();

  const store = useMemo(
    () =>
      createListStore({
        listRepository,
      }),
    [listRepository],
  );

  return store;
}
