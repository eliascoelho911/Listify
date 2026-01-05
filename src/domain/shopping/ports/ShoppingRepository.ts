import type { Category } from '../entities/Category';
import type { ShoppingItem } from '../entities/ShoppingItem';
import type { ShoppingList } from '../entities/ShoppingList';

export interface ShoppingRepository {
  getActiveList(): Promise<ShoppingList>;
  getCategories(): Promise<Category[]>;
  getItems(listId: string): Promise<ShoppingItem[]>;
  upsertItem(item: ShoppingItem): Promise<void>;
  deleteItem(itemId: string): Promise<void>;
  upsertCategory(category: Category): Promise<void>;
  transaction<T>(fn: (repo: ShoppingRepository) => Promise<T>): Promise<T>;
}
