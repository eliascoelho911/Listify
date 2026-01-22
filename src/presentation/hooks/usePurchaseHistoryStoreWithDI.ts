/**
 * usePurchaseHistoryStoreWithDI Hook
 *
 * Provides access to the purchase history store with automatic DI integration.
 * Creates a stable store instance using the repository from the DI container.
 */

import { useMemo } from 'react';

import { useAppDependencies } from '@app/di';

import {
  createPurchaseHistoryStore,
  type PurchaseHistoryStoreInstance,
} from '../stores/usePurchaseHistoryStore';

/**
 * Hook that creates and returns a purchase history store connected to DI repository.
 *
 * The store instance is memoized based on the repository reference,
 * so it will only be recreated if the DI container changes.
 *
 * @returns The purchase history store instance with all actions and state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const historyStore = usePurchaseHistoryStoreWithDI();
 *
 *   const handleComplete = async () => {
 *     const entry = await historyStore.getState().createEntry({
 *       listId: 'list-123',
 *       purchaseDate: new Date(),
 *       totalValue: 125.50,
 *       sections: [],
 *       items: [...],
 *     });
 *   };
 *
 *   // Subscribe to state changes
 *   const entries = historyStore(state => state.entries);
 * }
 * ```
 */
export function usePurchaseHistoryStoreWithDI(): PurchaseHistoryStoreInstance {
  const { purchaseHistoryRepository } = useAppDependencies();

  const store = useMemo(
    () =>
      createPurchaseHistoryStore({
        purchaseHistoryRepository,
      }),
    [purchaseHistoryRepository],
  );

  return store;
}
