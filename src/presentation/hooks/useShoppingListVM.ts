import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { ShoppingListStore } from '../state/shopping-list/shoppingListStore';
import { useShoppingListStoreApi } from '../state/shopping-list/ShoppingListStoreProvider';

export function useShoppingListVM(): {
  state: Pick<
    ShoppingListStore,
    | 'list'
    | 'categories'
    | 'totals'
    | 'monetaryTotals'
    | 'inputText'
    | 'preview'
    | 'isLoading'
    | 'isSubmitting'
    | 'lastError'
    | 'pendingUndo'
  >;
  actions: ShoppingListStore['actions'];
} {
  const store = useShoppingListStoreApi();

  const state = store(
    useShallow((s) => ({
      list: s.list,
      categories: s.categories,
      totals: s.totals,
      monetaryTotals: s.monetaryTotals,
      inputText: s.inputText,
      preview: s.preview,
      isLoading: s.isLoading,
      isSubmitting: s.isSubmitting,
      lastError: s.lastError,
      pendingUndo: s.pendingUndo,
    })),
  );

  const actions = store(useShallow((s) => s.actions));

  useEffect(() => {
    actions.load();
  }, [actions]);

  return {
    state,
    actions,
  };
}
