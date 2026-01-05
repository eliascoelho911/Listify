import type { ShoppingRepository } from '../ports/ShoppingRepository';
import { ItemNotFoundError } from './errors';

export type DeleteItemDeps = {
  repository: ShoppingRepository;
};

export async function deleteItem(itemId: string, deps: DeleteItemDeps): Promise<void> {
  const { repository } = deps;
  const list = await repository.getActiveList();
  await repository.transaction(async (txRepo) => {
    const items = await txRepo.getItems(list.id);
    const exists = items.some((item) => item.id === itemId);
    if (!exists) {
      throw new ItemNotFoundError(itemId);
    }
    await txRepo.deleteItem(itemId);
  });
}
