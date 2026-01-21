/**
 * useItemStoreWithDI Hook
 *
 * Provides access to the item store with automatic DI integration.
 * Creates a stable store instance using repositories from the DI container.
 */

import { useMemo } from 'react';

import { useAppDependencies } from '@app/di';

import { createItemStore, type ItemStoreInstance } from '../stores/useItemStore';

/**
 * Hook that creates and returns an item store connected to DI repositories.
 *
 * The store instance is memoized based on the repository references,
 * so it will only be recreated if the DI container changes.
 *
 * @returns The item store instance with all actions and state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const itemStore = useItemStoreWithDI();
 *
 *   const handleCreate = async () => {
 *     const item = await itemStore.getState().createItem({
 *       type: 'shopping',
 *       title: 'Milk',
 *       sortOrder: 0,
 *     });
 *   };
 *
 *   // Subscribe to state changes
 *   const items = itemStore(state => state.items);
 * }
 * ```
 */
export function useItemStoreWithDI(): ItemStoreInstance {
  const {
    noteItemRepository,
    shoppingItemRepository,
    movieItemRepository,
    bookItemRepository,
    gameItemRepository,
  } = useAppDependencies();

  const store = useMemo(
    () =>
      createItemStore({
        noteItemRepository,
        shoppingItemRepository,
        movieItemRepository,
        bookItemRepository,
        gameItemRepository,
      }),
    [
      noteItemRepository,
      shoppingItemRepository,
      movieItemRepository,
      bookItemRepository,
      gameItemRepository,
    ],
  );

  return store;
}
