/**
 * Inbox Store Provider
 *
 * Context provider for the inbox store using Zustand vanilla store pattern.
 */

import {
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStore } from 'zustand';

import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';

import { createInboxStore, type InboxStore, type InboxStoreApi } from './inboxStore';

type InboxStoreContextValue = {
  store: InboxStoreApi;
  repository: InboxRepository;
};

const InboxStoreContext = createContext<InboxStoreContextValue | null>(null);

type InboxStoreProviderProps = {
  children: ReactNode;
  repository: InboxRepository;
};

/**
 * Provider component for the inbox store.
 * Initializes the store and loads initial data.
 */
export function InboxStoreProvider({
  children,
  repository,
}: InboxStoreProviderProps): ReactElement {
  const [store] = useState(() => createInboxStore());

  return (
    <InboxStoreContext.Provider value={{ store, repository }}>
      {children}
    </InboxStoreContext.Provider>
  );
}

/**
 * Hook to access the inbox store context.
 *
 * @throws Error if used outside of InboxStoreProvider
 */
export function useInboxStoreContext(): InboxStoreContextValue {
  const context = useContext(InboxStoreContext);
  if (!context) {
    throw new Error('useInboxStoreContext must be used within an InboxStoreProvider');
  }
  return context;
}

/**
 * Hook to select state from the inbox store.
 * Use this for accessing store state with proper React subscriptions.
 */
export function useInboxStoreSelector<T>(selector: (state: InboxStore) => T): T {
  const { store } = useInboxStoreContext();
  return useStore(store, selector);
}
