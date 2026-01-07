import type { ShoppingItem } from '../entities/ShoppingItem';
import { Money } from '../value-objects/Money';

export type SummaryCounts = {
  totalItems: number;
  pendingItems: number;
  purchasedItems: number;
};

export type MonetarySummary = {
  currencyCode: string;
  totalEstimatedPendingMinor: number;
  totalSpentMinor: number;
  totalPlannedMinor: number;
};

export type ListSummary = {
  counts: SummaryCounts;
  monetary?: MonetarySummary;
};

export function computeListSummary(items: ShoppingItem[], currencyCode: string): ListSummary {
  const counts: SummaryCounts = {
    totalItems: items.length,
    pendingItems: 0,
    purchasedItems: 0,
  };

  let estimated = Money.zero(currencyCode);
  let spent = Money.zero(currencyCode);
  let hasEstimatedPrices = false;
  let hasSpentPrices = false;

  for (const item of items) {
    if (item.status === 'purchased') {
      counts.purchasedItems += 1;
    } else {
      counts.pendingItems += 1;
    }

    const priceMinor = resolveItemPriceMinor(item);
    if (priceMinor === undefined) {
      continue;
    }

    const money = Money.fromMinor(priceMinor, currencyCode);
    if (item.status === 'purchased') {
      spent = spent.add(money);
      hasSpentPrices = true;
    } else {
      estimated = estimated.add(money);
      hasEstimatedPrices = true;
    }
  }

  const hasAnyPrice = hasEstimatedPrices || hasSpentPrices;
  return {
    counts,
    monetary: hasAnyPrice
      ? {
          currencyCode,
          totalEstimatedPendingMinor: estimated.toMinor(),
          totalSpentMinor: spent.toMinor(),
          totalPlannedMinor: estimated.add(spent).toMinor(),
        }
      : undefined,
  };
}

function resolveItemPriceMinor(item: ShoppingItem): number | undefined {
  if (Number.isFinite(item.totalPriceMinor)) {
    return item.totalPriceMinor;
  }
  if (Number.isFinite(item.unitPriceMinor)) {
    return Math.round(item.quantity.toNumber() * (item.unitPriceMinor as number));
  }
  return undefined;
}
