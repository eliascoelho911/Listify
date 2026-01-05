import { getActiveListState } from '@domain/shopping/use-cases/GetActiveListState';

import { createCategory, createInMemoryRepository, createShoppingItem } from './testUtils';

describe('GetActiveListState', () => {
  it('groups items by category and returns totals', async () => {
    const repository = createInMemoryRepository({
      categories: [
        createCategory({ id: 'cat-1', name: 'hortifruti', sortOrder: 1 }),
        createCategory({ id: 'cat-2', name: 'bebidas', sortOrder: 2 }),
      ],
      items: [
        createShoppingItem({ id: 'item-1', categoryId: 'cat-1', status: 'pending', position: 1 }),
        createShoppingItem({ id: 'item-2', categoryId: 'cat-1', status: 'purchased', position: 2 }),
        createShoppingItem({ id: 'item-3', categoryId: 'cat-2', status: 'pending', position: 1 }),
        createShoppingItem({
          id: 'item-4',
          categoryId: 'cat-missing',
          status: 'pending',
          position: 1,
        }),
      ],
    });

    const result = await getActiveListState({ repository });

    expect(result.categories).toHaveLength(3);
    expect(result.categories[0].id).toBe('cat-1');
    expect(result.categories[0].items.pending).toHaveLength(1);
    expect(result.categories[0].items.purchased).toHaveLength(1);
    expect(result.categories[1].id).toBe('cat-2');
    expect(result.categories[1].items.pending).toHaveLength(1);

    const placeholder = result.categories[2];
    expect(placeholder.items.pending).toHaveLength(1);

    expect(result.totals.totalItems).toBe(4);
    expect(result.totals.pendingItems).toBe(3);
    expect(result.totals.purchasedItems).toBe(1);
  });
});
