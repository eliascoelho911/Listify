import { toggleItemPurchased } from '@domain/shopping/use-cases/ToggleItemPurchased';

import {
  buildClock,
  createCategory,
  createInMemoryRepository,
  createShoppingItem,
} from './testUtils';

describe('ToggleItemPurchased', () => {
  it('marks a pending item as purchased, setting purchasedAt and appending to purchased group', async () => {
    const fixedNow = new Date('2024-02-01T12:00:00.000Z');
    const repository = createInMemoryRepository({
      categories: [createCategory({ id: 'cat-1', name: 'hortifruti' })],
      items: [
        createShoppingItem({
          id: 'item-1',
          name: 'maçã',
          categoryId: 'cat-1',
          status: 'pending',
          position: 1,
        }),
        createShoppingItem({
          id: 'item-2',
          name: 'banana',
          categoryId: 'cat-1',
          status: 'pending',
          position: 2,
        }),
        createShoppingItem({
          id: 'item-3',
          name: 'pão',
          categoryId: 'cat-1',
          status: 'purchased',
          position: 1,
        }),
      ],
    });

    const updated = await toggleItemPurchased('item-1', {
      repository,
      clock: buildClock(fixedNow),
    });

    expect(updated.status).toBe('purchased');
    expect(updated.purchasedAt?.toISOString()).toBe(fixedNow.toISOString());
    expect(updated.position).toBe(2);

    const savedItems = await repository.getItems('list-1');
    const persisted = savedItems.find((item) => item.id === 'item-1');
    expect(persisted?.status).toBe('purchased');
    expect(persisted?.position).toBe(2);
  });

  it('marks a purchased item back to pending and appends to pending group', async () => {
    const repository = createInMemoryRepository({
      categories: [createCategory({ id: 'cat-1', name: 'hortifruti' })],
      items: [
        createShoppingItem({
          id: 'item-1',
          name: 'arroz',
          categoryId: 'cat-1',
          status: 'purchased',
          position: 1,
          purchasedAt: new Date('2024-01-01T10:00:00.000Z'),
        }),
        createShoppingItem({
          id: 'item-2',
          name: 'feijão',
          categoryId: 'cat-1',
          status: 'pending',
          position: 1,
        }),
        createShoppingItem({
          id: 'item-3',
          name: 'macarrão',
          categoryId: 'cat-1',
          status: 'pending',
          position: 2,
        }),
      ],
    });

    const updated = await toggleItemPurchased('item-1', { repository });

    expect(updated.status).toBe('pending');
    expect(updated.purchasedAt).toBeUndefined();
    expect(updated.position).toBe(3);

    const savedItems = await repository.getItems('list-1');
    const persisted = savedItems.find((item) => item.id === 'item-1');
    expect(persisted?.status).toBe('pending');
    expect(persisted?.position).toBe(3);
  });

  it('ignores items from other categories when computing new position', async () => {
    const repository = createInMemoryRepository({
      categories: [
        createCategory({ id: 'cat-1', name: 'hortifruti' }),
        createCategory({ id: 'cat-2', name: 'bebidas' }),
      ],
      items: [
        createShoppingItem({ id: 'item-1', categoryId: 'cat-1', status: 'pending', position: 1 }),
        createShoppingItem({ id: 'item-2', categoryId: 'cat-1', status: 'purchased', position: 1 }),
        createShoppingItem({ id: 'item-3', categoryId: 'cat-2', status: 'purchased', position: 5 }),
      ],
    });

    const updated = await toggleItemPurchased('item-1', { repository });

    expect(updated.position).toBe(2);
  });
});
