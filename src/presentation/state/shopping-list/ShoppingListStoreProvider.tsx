import { createContext, ReactElement, ReactNode, useContext, useMemo } from 'react';

import {
  createShoppingListStore,
  ShoppingListStoreApi,
  ShoppingListStoreDeps,
} from '@presentation/state/shopping-list/shoppingListStore';

export const ShoppingListStoreContext = createContext<ShoppingListStoreApi | null>(null);

type ShoppingListStoreProps = {
  children: ReactNode;
} & ShoppingListStoreDeps;

export function ShoppingListStoreProvider({
  children,
  repository,
  useCases,
  getLocale,
}: ShoppingListStoreProps): ReactElement {
  const store = useMemo(
    () => createShoppingListStore({ repository, useCases, getLocale }),
    [repository, useCases, getLocale],
  );

  return (
    <ShoppingListStoreContext.Provider value={store}>{children}</ShoppingListStoreContext.Provider>
  );
}

export function useShoppingListStoreApi(): ShoppingListStoreApi {
  const ctx = useContext(ShoppingListStoreContext);
  if (!ctx) {
    throw new Error('ShoppingListStoreProvider not found in component tree.');
  }
  return ctx;
}
