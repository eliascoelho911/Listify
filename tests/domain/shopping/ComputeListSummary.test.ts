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

  it('handles empty list correctly', () => {
    const items: ReturnType<typeof createShoppingItem>[] = [];
    const summary = computeListSummary(items, 'BRL');

    expect(summary.counts).toEqual({
      totalItems: 0,
      pendingItems: 0,
      purchasedItems: 0,
    });
    expect(summary.monetary).toBeUndefined();
  });

  it('handles list with only purchased items', () => {
    const items = [
      createShoppingItem({
        status: 'purchased',
        totalPriceMinor: 100,
      }),
      createShoppingItem({
        status: 'purchased',
        totalPriceMinor: 200,
      }),
    ];

    const summary = computeListSummary(items, 'BRL');

    expect(summary.counts).toEqual({
      totalItems: 2,
      pendingItems: 0,
      purchasedItems: 2,
    });
    expect(summary.monetary?.totalEstimatedPendingMinor).toBe(0);
    expect(summary.monetary?.totalSpentMinor).toBe(300);
    expect(summary.monetary?.totalPlannedMinor).toBe(300);
  });

  it('handles list with only pending items', () => {
    const items = [
      createShoppingItem({
        status: 'pending',
        totalPriceMinor: 100,
      }),
      createShoppingItem({
        status: 'pending',
        totalPriceMinor: 200,
      }),
    ];

    const summary = computeListSummary(items, 'BRL');

    expect(summary.counts).toEqual({
      totalItems: 2,
      pendingItems: 2,
      purchasedItems: 0,
    });
    expect(summary.monetary?.totalEstimatedPendingMinor).toBe(300);
    expect(summary.monetary?.totalSpentMinor).toBe(0);
    expect(summary.monetary?.totalPlannedMinor).toBe(300);
  });

  it('handles zero-priced items', () => {
    const items = [
      createShoppingItem({
        status: 'purchased',
        totalPriceMinor: 0,
      }),
      createShoppingItem({
        status: 'pending',
        unitPriceMinor: 0,
        quantity: Quantity.parse('5'),
      }),
    ];

    const summary = computeListSummary(items, 'BRL');

    expect(summary.counts.totalItems).toBe(2);
    expect(summary.monetary?.totalSpentMinor).toBe(0);
    expect(summary.monetary?.totalEstimatedPendingMinor).toBe(0);
    expect(summary.monetary?.totalPlannedMinor).toBe(0);
  });

  it('handles very large prices', () => {
    const items = [
      createShoppingItem({
        status: 'purchased',
        totalPriceMinor: 999999999,
      }),
      createShoppingItem({
        status: 'pending',
        totalPriceMinor: 888888888,
      }),
    ];

    const summary = computeListSummary(items, 'BRL');

    expect(summary.monetary?.totalSpentMinor).toBe(999999999);
    expect(summary.monetary?.totalEstimatedPendingMinor).toBe(888888888);
    expect(summary.monetary?.totalPlannedMinor).toBe(1888888887);
  });

  it('handles mixed items with and without prices', () => {
    const items = [
      createShoppingItem({
        status: 'purchased',
        totalPriceMinor: 100,
      }),
      createShoppingItem({
        status: 'purchased',
      }),
      createShoppingItem({
        status: 'pending',
        totalPriceMinor: 200,
      }),
      createShoppingItem({
        status: 'pending',
      }),
    ];

    const summary = computeListSummary(items, 'BRL');

    expect(summary.counts.totalItems).toBe(4);
    expect(summary.monetary?.totalSpentMinor).toBe(100);
    expect(summary.monetary?.totalEstimatedPendingMinor).toBe(200);
    expect(summary.monetary?.totalPlannedMinor).toBe(300);
  });

  it('uses provided currency code in monetary summary', () => {
    const items = [
      createShoppingItem({
        status: 'purchased',
        totalPriceMinor: 100,
      }),
    ];

    const summaryBRL = computeListSummary(items, 'BRL');
    const summaryUSD = computeListSummary(items, 'USD');

    expect(summaryBRL.monetary?.currencyCode).toBe('BRL');
    expect(summaryUSD.monetary?.currencyCode).toBe('USD');
  });

  it('calculates from unitPrice when quantity is fractional', () => {
    const items = [
      createShoppingItem({
        status: 'purchased',
        unitPriceMinor: 100,
        quantity: Quantity.parse('2.5'),
      }),
    ];

    const summary = computeListSummary(items, 'BRL');

    expect(summary.monetary?.totalSpentMinor).toBe(250);
  });
});
