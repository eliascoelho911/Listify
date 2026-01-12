/**
 * Inbox UI Store Provider
 *
 * Context provider for the inbox UI store using Zustand vanilla store pattern.
 * This provider only manages UI state - data comes from useLiveQuery.
 */

import { createContext, type ReactElement, type ReactNode, useContext, useState } from 'react';
import { useStore } from 'zustand';

import { createInboxUIStore, type InboxUIStore, type InboxUIStoreApi } from './inboxStore';

const InboxUIStoreContext = createContext<InboxUIStoreApi | null>(null);

type InboxUIStoreProviderProps = {
  children: ReactNode;
};

/**
 * Provider component for the inbox UI store.
 * Only manages UI state (inputText, isSubmitting, etc.)
 * Data (inputs) comes from useLiveQuery, not from this store.
 */
export function InboxUIStoreProvider({ children }: InboxUIStoreProviderProps): ReactElement {
  const [store] = useState(() => createInboxUIStore());

  return <InboxUIStoreContext.Provider value={store}>{children}</InboxUIStoreContext.Provider>;
}

/**
 * Hook to access the inbox UI store.
 *
 * @throws Error if used outside of InboxUIStoreProvider
 */
export function useInboxUIStore(): InboxUIStoreApi {
  const store = useContext(InboxUIStoreContext);
  if (!store) {
    throw new Error('useInboxUIStore must be used within an InboxUIStoreProvider');
  }
  return store;
}

/**
 * Hook to select state from the inbox UI store.
 * Use this for accessing store state with proper React subscriptions.
 */
export function useInboxUIStoreSelector<T>(selector: (state: InboxUIStore) => T): T {
  const store = useInboxUIStore();
  return useStore(store, selector);
}
