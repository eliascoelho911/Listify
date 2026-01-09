import { deleteItem } from '@domain/shopping/use-cases/DeleteItem';
import { ItemNotFoundError } from '@domain/shopping/use-cases/errors';

import { createInMemoryRepository, createShoppingItem } from './testUtils';

describe('DeleteItem', () => {
  it('deletes existing item successfully', async () => {
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({ id: 'item-1', name: 'apple' }),
        createShoppingItem({ id: 'item-2', name: 'banana' }),
        createShoppingItem({ id: 'item-3', name: 'orange' }),
      ],
    });

    await deleteItem('item-2', { repository });

    const items = await repository.getItems('list-1');
    expect(items).toHaveLength(2);
    expect(items.find((item) => item.id === 'item-2')).toBeUndefined();
    expect(items.find((item) => item.id === 'item-1')).toBeDefined();
    expect(items.find((item) => item.id === 'item-3')).toBeDefined();
  });

  it('throws ItemNotFoundError when item does not exist', async () => {
    const repository = createInMemoryRepository({
      items: [createShoppingItem({ id: 'item-1', name: 'apple' })],
    });

    await expect(deleteItem('non-existent-id', { repository })).rejects.toThrow(ItemNotFoundError);
  });

  it('throws ItemNotFoundError with correct message', async () => {
    const repository = createInMemoryRepository({
      items: [createShoppingItem({ id: 'item-1', name: 'apple' })],
    });

    await expect(deleteItem('missing-item', { repository })).rejects.toThrow(
      'Item not found: missing-item',
    );
  });

  it('does not affect other items when deletion fails', async () => {
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({ id: 'item-1', name: 'apple' }),
        createShoppingItem({ id: 'item-2', name: 'banana' }),
      ],
    });

    await expect(deleteItem('non-existent', { repository })).rejects.toThrow();

    const items = await repository.getItems('list-1');
    expect(items).toHaveLength(2);
  });

  it('removes item from repository permanently', async () => {
    const repository = createInMemoryRepository({
      items: [createShoppingItem({ id: 'item-to-delete', name: 'temporary' })],
    });

    await deleteItem('item-to-delete', { repository });

    const items = await repository.getItems('list-1');
    expect(items).toHaveLength(0);
  });

  it('handles deletion of purchased items', async () => {
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'purchased-item',
          name: 'milk',
          status: 'purchased',
          purchasedAt: new Date('2024-01-15T10:00:00.000Z'),
        }),
      ],
    });

    await deleteItem('purchased-item', { repository });

    const items = await repository.getItems('list-1');
    expect(items).toHaveLength(0);
  });

  it('handles deletion of items with prices', async () => {
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'priced-item',
          name: 'expensive item',
          unitPriceMinor: 1000,
          totalPriceMinor: 2000,
        }),
      ],
    });

    await deleteItem('priced-item', { repository });

    const items = await repository.getItems('list-1');
    expect(items).toHaveLength(0);
  });
});
