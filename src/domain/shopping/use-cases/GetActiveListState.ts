import type { Category } from '../entities/Category';
import type { ShoppingItem } from '../entities/ShoppingItem';
import type { ShoppingList } from '../entities/ShoppingList';
import type { ShoppingRepository } from '../ports/ShoppingRepository';
import { computeListSummary, type ListSummary } from './ComputeListSummary';

export type CategoryItems = Category & {
  items: {
    pending: ShoppingItem[];
    purchased: ShoppingItem[];
  };
};

export type GetActiveListStateResult = {
  list: ShoppingList;
  categories: CategoryItems[];
  summary: ListSummary;
  totals: ListSummary['counts'];
};

export type GetActiveListStateDeps = {
  repository: ShoppingRepository;
};

export async function getActiveListState(
  deps: GetActiveListStateDeps,
): Promise<GetActiveListStateResult> {
  const { repository } = deps;
  const list = await repository.getActiveList();
  const categories = await repository.getCategories();
  const items = await repository.getItems(list.id);

  const categoriesWithItems = initializeCategories(categories);

  for (const item of items) {
    const entry =
      categoriesWithItems.get(item.categoryId) ?? createPlaceholderCategory(categoriesWithItems);
    if (item.status === 'purchased') {
      entry.items.purchased.push(item);
    } else {
      entry.items.pending.push(item);
    }
  }

  const sortedCategories = Array.from(categoriesWithItems.values()).sort(sortByOrderAndName);
  const summary = computeListSummary(items, list.currencyCode);

  return {
    list,
    categories: sortedCategories,
    summary,
    totals: summary.counts,
  };
}

function initializeCategories(categories: Category[]): Map<string, CategoryItems> {
  return new Map(
    categories.map((category) => [
      category.id,
      {
        ...category,
        items: { pending: [], purchased: [] },
      },
    ]),
  );
}

function createPlaceholderCategory(map: Map<string, CategoryItems>): CategoryItems {
  const placeholder: CategoryItems = {
    id: `unknown-${map.size + 1}`,
    name: 'outros',
    isPredefined: false,
    sortOrder: map.size + 1,
    items: { pending: [], purchased: [] },
  };
  map.set(placeholder.id, placeholder);
  return placeholder;
}

function sortByOrderAndName(a: CategoryItems, b: CategoryItems): number {
  if (a.sortOrder !== b.sortOrder) {
    return a.sortOrder - b.sortOrder;
  }
  return a.name.localeCompare(b.name);
}
