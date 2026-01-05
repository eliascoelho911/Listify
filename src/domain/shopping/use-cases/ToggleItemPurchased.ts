import type { ShoppingItem } from '../entities/ShoppingItem';
import type { ShoppingRepository } from '../ports/ShoppingRepository';
import { ItemNotFoundError } from './errors';

export type ToggleItemPurchasedDeps = {
  repository: ShoppingRepository;
  clock?: () => Date;
};

export async function toggleItemPurchased(
  itemId: string,
  deps: ToggleItemPurchasedDeps,
): Promise<ShoppingItem> {
  const { repository, clock = () => new Date() } = deps;
  const list = await repository.getActiveList();

  return repository.transaction(async (txRepo) => {
    const items = await txRepo.getItems(list.id);
    const current = items.find((item) => item.id === itemId);
    if (!current) {
      throw new ItemNotFoundError(itemId);
    }

    const now = clock();
    const nextStatus = current.status === 'pending' ? 'purchased' : 'pending';
    const position = computeNextPosition(items, current.categoryId, nextStatus, current.id);

    const updated: ShoppingItem = {
      ...current,
      status: nextStatus,
      position,
      purchasedAt: nextStatus === 'purchased' ? now : undefined,
      updatedAt: now,
    };

    await txRepo.upsertItem(updated);
    return updated;
  });
}

function computeNextPosition(
  items: ShoppingItem[],
  categoryId: string,
  status: ShoppingItem['status'],
  excludeItemId: string,
): number {
  const positions = items
    .filter(
      (item) =>
        item.categoryId === categoryId && item.status === status && item.id !== excludeItemId,
    )
    .map((item) => item.position)
    .filter((position) => Number.isFinite(position));

  const maxPosition = positions.length ? Math.max(...positions) : 0;
  return maxPosition + 1;
}
