import { computeListSummary } from '@domain/shopping/use-cases/ComputeListSummary';
import { Quantity } from '@domain/shopping/value-objects/Quantity';

import { createInMemoryRepository, createShoppingItem } from './testUtils';

describe('ComputeListSummary', () => {
  it('calculates counts and monetary totals using unit or total price', async () => {
    const repo = createInMemoryRepository({
      items: [
        createShoppingItem({
          id: 'pending-total',
          status: 'pending',
          totalPriceMinor: 150,
        }),
        createShoppingItem({
          id: 'pending-unit',
          status: 'pending',
          quantity: Quantity.parse('2'),
          unitPriceMinor: 100,
        }),
        createShoppingItem({
          id: 'purchased-total',
          status: 'purchased',
          totalPriceMinor: 500,
        }),
        createShoppingItem({
          id: 'purchased-unit',
          status: 'purchased',
          quantity: Quantity.parse('3'),
          unitPriceMinor: 50,
        }),
      ],
    });

    const items = await repo.getItems('list-1');
    const summary = computeListSummary(items, 'BRL');

    expect(summary.counts).toEqual({
      totalItems: 4,
      pendingItems: 2,
      purchasedItems: 2,
    });
    expect(summary.monetary).toEqual({
      currencyCode: 'BRL',
      totalEstimatedPendingMinor: 350,
      totalSpentMinor: 650,
      totalPlannedMinor: 1000,
    });
  });

  it('omits monetary totals when no prices are available', async () => {
    const repo = createInMemoryRepository({
      items: [
        createShoppingItem({ status: 'pending' }),
        createShoppingItem({ status: 'purchased' }),
      ],
    });

    const items = await repo.getItems('list-1');
    const summary = computeListSummary(items, 'BRL');

    expect(summary.counts.totalItems).toBe(2);
    expect(summary.monetary).toBeUndefined();
  });

  it('prefers totalPriceMinor over unitPriceMinor when both are present', () => {
    const items = [
      createShoppingItem({
        status: 'purchased',
        totalPriceMinor: 1000,
        unitPriceMinor: 500,
        quantity: Quantity.parse('10'),
      }),
    ];

    const summary = computeListSummary(items, 'BRL');

    expect(summary.monetary?.totalSpentMinor).toBe(1000);
  });
});
