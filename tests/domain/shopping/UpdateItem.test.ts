import { updateItem } from '@domain/shopping/use-cases/UpdateItem';
import { Quantity } from '@domain/shopping/value-objects/Quantity';

import { buildClock, createInMemoryRepository, createShoppingItem } from './testUtils';

describe('UpdateItem', () => {
  it('recalculates totalPrice when quantity changes and unitPrice is present', async () => {
    const fixedNow = new Date('2024-03-01T08:00:00.000Z');
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'item-1',
          quantity: Quantity.parse('2'),
          unitPriceMinor: 500,
          totalPriceMinor: 1000,
        }),
      ],
    });

    const updated = await updateItem(
      {
        itemId: 'item-1',
        quantity: Quantity.parse('3'),
        priceSource: 'unit',
      },
      { repository, clock: buildClock(fixedNow) },
    );

    expect(updated.quantity.toNumber()).toBe(3);
    expect(updated.unitPriceMinor).toBe(500);
    expect(updated.totalPriceMinor).toBe(1500);
    expect(updated.updatedAt.toISOString()).toBe(fixedNow.toISOString());
  });

  it('recalculates unitPrice when quantity changes and totalPrice is present', async () => {
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'item-1',
          quantity: Quantity.parse('2'),
          totalPriceMinor: 1000,
        }),
      ],
    });

    const updated = await updateItem(
      {
        itemId: 'item-1',
        quantity: 4,
        priceSource: 'total',
      },
      { repository },
    );

    expect(updated.totalPriceMinor).toBe(1000);
    expect(updated.unitPriceMinor).toBe(250);
  });

  it('preserves status and purchasedAt while updating fields', async () => {
    const purchasedAt = new Date('2024-01-10T10:00:00.000Z');
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'item-1',
          name: 'leite',
          status: 'purchased',
          purchasedAt,
          unitPriceMinor: 400,
          totalPriceMinor: 400,
        }),
      ],
    });

    const updated = await updateItem(
      {
        itemId: 'item-1',
        name: 'leite integral',
        unitPriceMinor: 500,
        priceSource: 'unit',
      },
      { repository },
    );

    expect(updated.status).toBe('purchased');
    expect(updated.purchasedAt?.toISOString()).toBe(purchasedAt.toISOString());
    expect(updated.unitPriceMinor).toBe(500);
  });

  it('throws ItemNotFoundError when updating non-existent item', async () => {
    const repository = createInMemoryRepository({
      items: [createShoppingItem({ id: 'item-1', name: 'apple' })],
    });

    await expect(
      updateItem(
        {
          itemId: 'non-existent-id',
          name: 'updated name',
          priceSource: 'unit',
        },
        { repository },
      ),
    ).rejects.toThrow('Item not found: non-existent-id');
  });

  it('maintains consistency between status and purchasedAt when pending', async () => {
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'item-1',
          name: 'item',
          status: 'pending',
          purchasedAt: undefined,
        }),
      ],
    });

    const updated = await updateItem(
      {
        itemId: 'item-1',
        name: 'updated item',
        priceSource: 'unit',
      },
      { repository },
    );

    expect(updated.status).toBe('pending');
    expect(updated.purchasedAt).toBeUndefined();
  });

  it('maintains consistency between status and purchasedAt when purchased', async () => {
    const purchasedAt = new Date('2024-01-15T10:00:00.000Z');
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'item-1',
          name: 'item',
          status: 'purchased',
          purchasedAt,
        }),
      ],
    });

    const updated = await updateItem(
      {
        itemId: 'item-1',
        name: 'updated item',
        priceSource: 'unit',
      },
      { repository },
    );

    expect(updated.status).toBe('purchased');
    expect(updated.purchasedAt).toBeDefined();
    expect(updated.purchasedAt?.toISOString()).toBe(purchasedAt.toISOString());
  });

  it('handles updating item with no prices to having prices', async () => {
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'item-1',
          name: 'item',
          quantity: Quantity.parse('1'),
          unitPriceMinor: undefined,
          totalPriceMinor: undefined,
        }),
      ],
    });

    const updated = await updateItem(
      {
        itemId: 'item-1',
        unitPriceMinor: 500,
        priceSource: 'unit',
      },
      { repository },
    );

    expect(updated.unitPriceMinor).toBe(500);
    expect(updated.totalPriceMinor).toBe(500);
  });

  it('handles removing prices by setting to null', async () => {
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'item-1',
          name: 'item',
          unitPriceMinor: 500,
          totalPriceMinor: 1000,
        }),
      ],
    });

    const updated = await updateItem(
      {
        itemId: 'item-1',
        unitPriceMinor: null,
        totalPriceMinor: null,
        priceSource: 'unit',
      },
      { repository },
    );

    expect(updated.unitPriceMinor).toBeUndefined();
    expect(updated.totalPriceMinor).toBeUndefined();
  });

  it('preserves other fields when updating only name', async () => {
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'item-1',
          name: 'original',
          quantity: Quantity.parse('5'),
          unit: 'kg',
          categoryId: 'cat-1',
          position: 2,
        }),
      ],
    });

    const updated = await updateItem(
      {
        itemId: 'item-1',
        name: 'updated',
        priceSource: 'unit',
      },
      { repository },
    );

    expect(updated.name).toBe('updated');
    expect(updated.quantity.toNumber()).toBe(5);
    expect(updated.unit).toBe('kg');
    expect(updated.categoryId).toBe('cat-1');
    expect(updated.position).toBe(2);
  });

  it('updates timestamp when item is modified', async () => {
    const fixedNow = new Date('2024-03-01T08:00:00.000Z');
    const repository = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'item-1',
          name: 'item',
          updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        }),
      ],
    });

    const updated = await updateItem(
      {
        itemId: 'item-1',
        name: 'updated item',
        priceSource: 'unit',
      },
      { repository, clock: buildClock(fixedNow) },
    );

    expect(updated.updatedAt.toISOString()).toBe(fixedNow.toISOString());
  });
});
