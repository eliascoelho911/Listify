import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'zustand';

import { FALLBACK_LOCALE } from '@domain/shopping/constants';

import { useDependencies } from '../../app/providers/AppProviders';
import {
  createShoppingListStore,
  type ShoppingListStore,
  type ShoppingListStoreApi,
} from '../state/shoppingListStore';

let sharedStore: ShoppingListStoreApi | null = null;
let sharedRepositoryId: string | null = null;

export function useShoppingListVM(): {
  store: ShoppingListStoreApi;
  state: Pick<
    ShoppingListStore,
    | 'list'
    | 'categories'
    | 'totals'
    | 'inputText'
    | 'preview'
    | 'isLoading'
    | 'isSubmitting'
    | 'lastError'
    | 'pendingUndo'
  >;
  actions: ShoppingListStore['actions'];
} {
  const dependencies = useDependencies();
  const { i18n } = useTranslation();

  const repositoryId = 'shopping-repo';
  const store = useMemo<ShoppingListStoreApi>(() => {
    if (!sharedStore || sharedRepositoryId !== repositoryId) {
      sharedStore = createShoppingListStore({
        repository: dependencies.shoppingRepository,
        getLocale: () => i18n.language || FALLBACK_LOCALE,
      });
      sharedRepositoryId = repositoryId;
    }
    return sharedStore;
  }, [dependencies.shoppingRepository, i18n.language]);

  useEffect(() => {
    store.getState().actions.load();
  }, [store, i18n.language]);

  const state = useStore(store, (current) => ({
    list: current.list,
    categories: current.categories,
    totals: current.totals,
    inputText: current.inputText,
    preview: current.preview,
    isLoading: current.isLoading,
    isSubmitting: current.isSubmitting,
    lastError: current.lastError,
    pendingUndo: current.pendingUndo,
  }));

  return {
    store,
    state,
    actions: store.getState().actions,
  };
}
