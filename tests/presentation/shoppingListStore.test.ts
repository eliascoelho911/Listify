import { createShoppingListStore } from '@presentation/state/shopping-list/shoppingListStore';

import {
  createCategory,
  createInMemoryRepository,
  createMockUseCases,
  createShoppingItem,
  createShoppingList,
} from '../domain/shopping/testUtils';

describe('shoppingListStore filters', () => {
  it('filters visible categories by search query', async () => {
    const repository = createInMemoryRepository({
      categories: [createCategory({ id: 'cat-1', name: 'hortifruti', sortOrder: 1 })],
      items: [
        createShoppingItem({ id: 'item-1', name: 'Apples', categoryId: 'cat-1' }),
        createShoppingItem({ id: 'item-2', name: 'Banana', categoryId: 'cat-1' }),
      ],
    });
    const useCases = createMockUseCases(repository);
    const store = createShoppingListStore({ repository, useCases });

    await store.getState().actions.load();
    expect(store.getState().visibleCategories[0].items.pending).toHaveLength(2);

    store.getState().actions.setSearchQuery('ban');

    expect(store.getState().visibleCategories[0].items.pending).toHaveLength(1);
    expect(store.getState().visibleCategories[0].items.pending[0].id).toBe('item-2');
  });

  it('hides purchased items when preference is toggled and persisted', async () => {
    const repository = createInMemoryRepository({
      list: createShoppingList({ id: 'list-1', hidePurchasedByDefault: false }),
      categories: [createCategory({ id: 'cat-1', name: 'hortifruti', sortOrder: 1 })],
      items: [
        createShoppingItem({ id: 'item-1', status: 'purchased', categoryId: 'cat-1' }),
        createShoppingItem({ id: 'item-2', status: 'pending', categoryId: 'cat-1' }),
      ],
    });
    const useCases = createMockUseCases(repository);
    const store = createShoppingListStore({ repository, useCases });

    await store.getState().actions.load();
    expect(store.getState().visibleCategories[0].items.purchased).toHaveLength(1);

    await store.getState().actions.toggleHidePurchased();
    const state = store.getState();

    expect(state.filters.hidePurchased).toBe(true);
    expect(state.visibleCategories[0].items.purchased).toHaveLength(0);

    const persistedList = await repository.getActiveList();
    expect(persistedList.hidePurchasedByDefault).toBe(true);
  });
});
