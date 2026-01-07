import { updatePreferences } from '@domain/shopping/use-cases/UpdatePreferences';

import { createInMemoryRepository, createShoppingList } from './testUtils';

describe('UpdatePreferences', () => {
  it('updates hidePurchasedByDefault and returns the updated list', async () => {
    const repository = createInMemoryRepository({
      list: createShoppingList({ id: 'list-1', hidePurchasedByDefault: false }),
    });

    const result = await updatePreferences(
      { listId: 'list-1', hidePurchasedByDefault: true },
      { repository },
    );

    expect(result.hidePurchasedByDefault).toBe(true);
    const persisted = await repository.getActiveList();
    expect(persisted.hidePurchasedByDefault).toBe(true);
    expect(persisted.askPriceOnPurchase).toBe(false);
  });

  it('preserves fields that are not provided', async () => {
    const repository = createInMemoryRepository({
      list: createShoppingList({
        id: 'list-1',
        hidePurchasedByDefault: true,
        askPriceOnPurchase: true,
      }),
    });

    const result = await updatePreferences({ listId: 'list-1' }, { repository });

    expect(result.hidePurchasedByDefault).toBe(true);
    expect(result.askPriceOnPurchase).toBe(true);
  });
});
