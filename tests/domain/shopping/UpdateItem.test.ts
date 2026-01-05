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
});
