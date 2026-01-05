import type { ShoppingItem } from '../entities/ShoppingItem';
import type { ShoppingRepository } from '../ports/ShoppingRepository';
import { Quantity } from '../value-objects/Quantity';
import type { UnitCode } from '../value-objects/Unit';
import { EmptyItemNameError } from './CreateItemFromFreeText';
import { ItemNotFoundError } from './errors';

export type UpdateItemInput = {
  itemId: string;
  name?: string;
  quantity?: Quantity | number | string;
  unit?: UnitCode;
  categoryId?: string;
  unitPriceMinor?: number | null;
  totalPriceMinor?: number | null;
  priceSource?: 'unit' | 'total';
};

export type UpdateItemDeps = {
  repository: ShoppingRepository;
  clock?: () => Date;
};

export async function updateItem(
  input: UpdateItemInput,
  deps: UpdateItemDeps,
): Promise<ShoppingItem> {
  const { repository, clock = () => new Date() } = deps;
  const list = await repository.getActiveList();

  return repository.transaction(async (txRepo) => {
    const items = await txRepo.getItems(list.id);
    const current = items.find((item) => item.id === input.itemId);
    if (!current) {
      throw new ItemNotFoundError(input.itemId);
    }

    const now = clock();
    const name = input.name !== undefined ? input.name.trim() : current.name;
    if (!name) {
      throw new EmptyItemNameError();
    }

    const quantity = normalizeQuantity(input.quantity) ?? current.quantity;
    const unit = input.unit ?? current.unit;
    const categoryId = input.categoryId ?? current.categoryId;

    let unitPriceMinor = normalizePrice(input.unitPriceMinor, current.unitPriceMinor);
    let totalPriceMinor = normalizePrice(input.totalPriceMinor, current.totalPriceMinor);

    const shouldRecalculateFromUnit =
      input.priceSource === 'unit' ||
      (input.quantity !== undefined &&
        unitPriceMinor !== undefined &&
        input.totalPriceMinor === undefined);

    const shouldRecalculateFromTotal =
      input.priceSource === 'total' ||
      (input.quantity !== undefined &&
        totalPriceMinor !== undefined &&
        input.unitPriceMinor === undefined);

    if (shouldRecalculateFromUnit && unitPriceMinor !== undefined) {
      totalPriceMinor = calculateTotalPrice(quantity, unitPriceMinor);
    } else if (shouldRecalculateFromTotal && totalPriceMinor !== undefined) {
      unitPriceMinor = calculateUnitPrice(quantity, totalPriceMinor);
    }

    const updated: ShoppingItem = {
      ...current,
      name,
      quantity,
      unit,
      categoryId,
      unitPriceMinor,
      totalPriceMinor,
      updatedAt: now,
    };

    await txRepo.upsertItem(updated);
    return updated;
  });
}

function normalizeQuantity(value: UpdateItemInput['quantity']): Quantity | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value instanceof Quantity) {
    return value;
  }

  return Quantity.parse(value);
}

function normalizePrice(
  candidate: number | null | undefined,
  fallback: number | undefined,
): number | undefined {
  if (candidate === null) {
    return undefined;
  }
  if (candidate === undefined) {
    return fallback;
  }
  return candidate;
}

function calculateTotalPrice(quantity: Quantity, unitPriceMinor: number): number {
  return Math.round(quantity.toNumber() * unitPriceMinor);
}

function calculateUnitPrice(quantity: Quantity, totalPriceMinor: number): number {
  return Math.round(totalPriceMinor / quantity.toNumber());
}
