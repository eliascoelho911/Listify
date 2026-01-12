import type { ShoppingUseCases } from '@app/di/types';
import { DEFAULT_CURRENCY_CODE } from '@domain/shopping/constants';
import type { Category } from '@domain/shopping/entities/Category';
import type { ShoppingItem } from '@domain/shopping/entities/ShoppingItem';
import type { ShoppingList } from '@domain/shopping/entities/ShoppingList';
import type {
  ShoppingRepository,
  UpdateListPreferencesInput,
} from '@domain/shopping/ports/ShoppingRepository';
import { deleteItem } from '@domain/shopping/use-cases/DeleteItem';
import { getActiveListState } from '@domain/shopping/use-cases/GetActiveListState';
import { toggleItemPurchased } from '@domain/shopping/use-cases/ToggleItemPurchased';
import { updateItem } from '@domain/shopping/use-cases/UpdateItem';
import { updatePreferences } from '@domain/shopping/use-cases/UpdatePreferences';
import { Quantity } from '@domain/shopping/value-objects/Quantity';

type InMemoryState = {
  list: ShoppingList;
  categories: Category[];
  items: ShoppingItem[];
};

export class InMemoryShoppingRepository implements ShoppingRepository {
  constructor(private readonly state: InMemoryState) {}

  async getActiveList(): Promise<ShoppingList> {
    return this.clone(this.state.list);
  }

  async getCategories(): Promise<Category[]> {
    return this.state.categories.map((category) => this.clone(category));
  }

  async getItems(listId: string): Promise<ShoppingItem[]> {
    return this.state.items
      .filter((item) => item.listId === listId)
      .map((item) => this.clone(item));
  }

  async upsertItem(item: ShoppingItem): Promise<void> {
    const index = this.state.items.findIndex((candidate) => candidate.id === item.id);
    if (index >= 0) {
      this.state.items[index] = this.clone(item);
      return;
    }
    this.state.items.push(this.clone(item));
  }

  async deleteItem(itemId: string): Promise<void> {
    this.state.items = this.state.items.filter((item) => item.id !== itemId);
  }

  async upsertCategory(category: Category): Promise<void> {
    const index = this.state.categories.findIndex((candidate) => candidate.id === category.id);
    if (index >= 0) {
      this.state.categories[index] = this.clone(category);
      return;
    }
    this.state.categories.push(this.clone(category));
  }

  async updateListPreferences(preferences: UpdateListPreferencesInput): Promise<ShoppingList> {
    if (preferences.listId !== this.state.list.id) {
      throw new Error('list_not_found');
    }
    const updated: ShoppingList = {
      ...this.state.list,
      hidePurchasedByDefault:
        preferences.hidePurchasedByDefault ?? this.state.list.hidePurchasedByDefault,
      askPriceOnPurchase: preferences.askPriceOnPurchase ?? this.state.list.askPriceOnPurchase,
      updatedAt: new Date(),
    };
    this.state.list = this.clone(updated);
    return this.clone(updated);
  }

  async transaction<T>(fn: (repo: ShoppingRepository) => Promise<T>): Promise<T> {
    return fn(this);
  }

  private clone<TValue>(value: TValue): TValue {
    return value;
  }
}

export function createInMemoryRepository(
  overrides: Partial<InMemoryState> = {},
): InMemoryShoppingRepository {
  const now = new Date('2024-01-01T00:00:00.000Z');
  const list = createShoppingList(overrides.list);
  const categories = overrides.categories ?? [
    createCategory({ id: 'cat-default', name: 'outros' }),
  ];
  const items = overrides.items ?? [];

  return new InMemoryShoppingRepository({
    list,
    categories,
    items: items.map((item) => ({
      ...item,
      listId: item.listId ?? list.id,
      createdAt: item.createdAt ?? now,
      updatedAt: item.updatedAt ?? now,
    })),
  });
}

export function createShoppingList(overrides: Partial<ShoppingList> = {}): ShoppingList {
  const now = new Date('2024-01-01T00:00:00.000Z');
  return {
    id: overrides.id ?? 'list-1',
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    currencyCode: overrides.currencyCode ?? DEFAULT_CURRENCY_CODE,
    isCompleted: overrides.isCompleted ?? false,
    completedAt: overrides.completedAt,
    hidePurchasedByDefault: overrides.hidePurchasedByDefault ?? false,
    askPriceOnPurchase: overrides.askPriceOnPurchase ?? false,
  };
}

export function createCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: overrides.id ?? 'cat-1',
    name: overrides.name ?? 'categoria',
    isPredefined: overrides.isPredefined ?? false,
    sortOrder: overrides.sortOrder ?? 1,
  };
}

export function createShoppingItem(overrides: Partial<ShoppingItem> = {}): ShoppingItem {
  const now = new Date('2024-01-01T00:00:00.000Z');
  return {
    id: overrides.id ?? 'item-1',
    listId: overrides.listId ?? 'list-1',
    name: overrides.name ?? 'item',
    quantity: overrides.quantity ?? Quantity.default(),
    unit: overrides.unit ?? 'un',
    categoryId: overrides.categoryId ?? 'cat-1',
    status: overrides.status ?? 'pending',
    position: overrides.position ?? 1,
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    purchasedAt: overrides.purchasedAt,
    unitPriceMinor: overrides.unitPriceMinor,
    totalPriceMinor: overrides.totalPriceMinor,
  };
}

export function buildClock(fixed: Date): () => Date {
  return () => new Date(fixed);
}

export function createMockUseCases(repository: ShoppingRepository): ShoppingUseCases {
  const clock = () => new Date();

  return {
    getActiveListState: () => getActiveListState({ repository }),
    toggleItemPurchased: (itemId) => toggleItemPurchased(itemId, { repository, clock }),
    updateItem: (input) => updateItem(input, { repository, clock }),
    deleteItem: (itemId) => deleteItem(itemId, { repository }),
    updatePreferences: (preferences) => updatePreferences(preferences, { repository }),
  };
}
