import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';

import { DEFAULT_CATEGORY_CODE, FALLBACK_LOCALE } from '@domain/shopping/constants';
import type { Category } from '@domain/shopping/entities/Category';
import type { ShoppingItem, ShoppingItemStatus } from '@domain/shopping/entities/ShoppingItem';
import type { ShoppingList } from '@domain/shopping/entities/ShoppingList';
import type { ShoppingRepository } from '@domain/shopping/ports/ShoppingRepository';
import {
  computeListSummary,
  type MonetarySummary,
} from '@domain/shopping/use-cases/ComputeListSummary';
import {
  createItemFromFreeText,
  type CreateItemFromFreeTextResult,
  EmptyItemNameError,
} from '@domain/shopping/use-cases/CreateItemFromFreeText';
import { deleteItem as deleteItemUseCase } from '@domain/shopping/use-cases/DeleteItem';
import {
  type CategoryItems,
  getActiveListState,
} from '@domain/shopping/use-cases/GetActiveListState';
import { toggleItemPurchased } from '@domain/shopping/use-cases/ToggleItemPurchased';
import {
  updateItem as updateItemUseCase,
  type UpdateItemInput,
} from '@domain/shopping/use-cases/UpdateItem';
import { updatePreferences } from '@domain/shopping/use-cases/UpdatePreferences';

type StoreError = {
  type: 'load' | 'write';
  message?: string;
};

type ShoppingListFilters = {
  query: string;
  hidePurchased: boolean;
};

type ShoppingListState = {
  list: ShoppingList | null;
  categories: CategoryItems[];
  visibleCategories: CategoryItems[];
  totals: {
    totalItems: number;
    pendingItems: number;
    purchasedItems: number;
  };
  monetaryTotals?: MonetarySummary;
  inputText: string;
  preview: CreateItemFromFreeTextResult | null;
  isLoading: boolean;
  isSubmitting: boolean;
  lastError: StoreError | null;
  pendingUndo?: ShoppingItem;
  filters: ShoppingListFilters;
};

type ShoppingListActions = {
  load: () => Promise<void>;
  refresh: () => Promise<void>;
  setInputText: (text: string) => void;
  addItemFromInput: () => Promise<void>;
  toggleItemStatus: (itemId: string) => Promise<void>;
  updateItem: (input: UpdateItemInput) => Promise<ShoppingItem | null>;
  removeItem: (itemId: string) => Promise<void>;
  undoRemove: () => Promise<void>;
  dismissUndo: () => void;
  setSearchQuery: (query: string) => void;
  toggleHidePurchased: () => Promise<void>;
  clearError: () => void;
};

export type ShoppingListStore = ShoppingListState & { actions: ShoppingListActions };
export type ShoppingListStoreApi = UseBoundStore<StoreApi<ShoppingListStore>>;

export type ShoppingListStoreDeps = {
  repository: ShoppingRepository;
  getLocale?: () => string;
};

export function createShoppingListStore(deps: ShoppingListStoreDeps): ShoppingListStoreApi {
  const repository = deps.repository;
  const resolveLocale = (): string => deps.getLocale?.() ?? FALLBACK_LOCALE;

  const refreshFromRepository = async (): Promise<{
    list: ShoppingList;
    categories: CategoryItems[];
    totals: ShoppingListState['totals'];
    monetaryTotals?: MonetarySummary;
  }> => {
    const result = await getActiveListState({ repository });
    return {
      list: result.list,
      categories: result.categories,
      totals: result.summary.counts,
      monetaryTotals: result.summary.monetary,
    };
  };

  return create<ShoppingListStore>((set, get) => ({
    list: null,
    categories: [],
    visibleCategories: [],
    totals: { totalItems: 0, pendingItems: 0, purchasedItems: 0 },
    monetaryTotals: undefined,
    inputText: '',
    preview: null,
    isLoading: true,
    isSubmitting: false,
    lastError: null,
    filters: { query: '', hidePurchased: false },

    actions: {
      load: async () => {
        set((state) => ({
          ...state,
          isLoading: true,
          lastError: null,
        }));

        try {
          const refreshed = await refreshFromRepository();
          const filters = resolveFiltersFromList(refreshed.list, get().filters);
          const derived = deriveStateFromCategories(refreshed.categories, refreshed.list, filters);
          set((state) => ({
            ...state,
            ...refreshed,
            ...derived,
            filters,
            isLoading: false,
            lastError: null,
          }));
        } catch (error) {
          console.debug('shoppingListStore.load_failed', { error });
          set((state) => ({
            ...state,
            isLoading: false,
            lastError: {
              type: 'load',
              message: error instanceof Error ? error.message : 'load_failed',
            },
          }));
        }
      },

      refresh: async () => {
        try {
          const refreshed = await refreshFromRepository();
          const filters = resolveFiltersFromList(refreshed.list, get().filters);
          const derived = deriveStateFromCategories(refreshed.categories, refreshed.list, filters);
          set((state) => ({
            ...state,
            ...refreshed,
            ...derived,
            filters,
            lastError: null,
          }));
        } catch (error) {
          console.debug('shoppingListStore.refresh_failed', { error });
          set((state) => ({
            ...state,
            lastError: {
              type: 'load',
              message: error instanceof Error ? error.message : 'load_failed',
            },
          }));
        }
      },

      setInputText: (text: string) => {
        const locale = resolveLocale();
        const preview = buildPreview(text, locale);
        set((state) => ({
          ...state,
          inputText: text,
          preview,
        }));
      },

      addItemFromInput: async () => {
        const { list, categories, inputText } = get();
        if (!list) {
          set((state) => ({
            ...state,
            lastError: { type: 'load', message: 'missing_list' },
          }));
          return;
        }

        const locale = resolveLocale();
        let parsed: CreateItemFromFreeTextResult;
        try {
          parsed = createItemFromFreeText(inputText, {
            locale,
            defaultCategory: DEFAULT_CATEGORY_CODE,
          });
        } catch (error) {
          console.debug('shoppingListStore.parse_input_failed', { error });
          set((state) => ({
            ...state,
            lastError: {
              type: 'write',
              message: error instanceof Error ? error.message : 'parse_failed',
            },
          }));
          return;
        }

        const now = new Date();
        const targetCategory = findCategoryByName(categories, parsed.category);
        const categoryId = targetCategory?.id ?? generateId();
        const categoryName = targetCategory?.name ?? parsed.category;
        const sortOrder = targetCategory?.sortOrder ?? computeNextSortOrder(categories);
        const position = computeNextPosition(categories, categoryId, 'pending');

        const newItem: ShoppingItem = {
          id: generateId(),
          listId: list.id,
          name: parsed.name,
          quantity: parsed.quantity,
          unit: parsed.unit,
          categoryId,
          status: 'pending',
          position,
          createdAt: now,
          updatedAt: now,
        };

        const snapshot = snapshotState(get());
        const optimisticCategories = insertItem(categories, newItem, {
          id: categoryId,
          name: categoryName,
          isPredefined: targetCategory?.isPredefined ?? false,
          sortOrder,
        });
        const optimisticDerived = deriveStateFromCategories(
          optimisticCategories,
          list,
          snapshot.filters,
        );

        set((state) => ({
          ...state,
          ...optimisticDerived,
          inputText: '',
          preview: null,
          isSubmitting: true,
          lastError: null,
        }));

        try {
          await repository.transaction(async (txRepo) => {
            if (!targetCategory) {
              await txRepo.upsertCategory({
                id: categoryId,
                name: categoryName,
                isPredefined: false,
                sortOrder,
              });
            }
            await txRepo.upsertItem(newItem);
          });
          const refreshed = await refreshFromRepository();
          const filters = resolveFiltersFromList(refreshed.list, snapshot.filters);
          const derived = deriveStateFromCategories(refreshed.categories, refreshed.list, filters);
          set((state) => ({
            ...state,
            ...refreshed,
            ...derived,
            filters,
            isSubmitting: false,
          }));
        } catch (error) {
          console.debug('shoppingListStore.add_item_failed', { error });
          set((state) => ({
            ...state,
            ...snapshot,
            inputText,
            preview: buildPreview(inputText, locale),
            isSubmitting: false,
            lastError: {
              type: 'write',
              message: error instanceof Error ? error.message : 'add_failed',
            },
          }));
        }
      },

      toggleItemStatus: async (itemId: string) => {
        const stateSnapshot = snapshotState(get());
        const currentItem = findItem(stateSnapshot.categories, itemId);
        if (!currentItem) {
          set((state) => ({
            ...state,
            lastError: { type: 'write', message: 'item_not_found' },
          }));
          return;
        }

        const now = new Date();
        const nextStatus: ShoppingItemStatus =
          currentItem.status === 'pending' ? 'purchased' : 'pending';
        const nextPosition = computeNextPosition(
          stateSnapshot.categories,
          currentItem.categoryId,
          nextStatus,
          currentItem.id,
        );
        const optimisticItem: ShoppingItem = {
          ...currentItem,
          status: nextStatus,
          position: nextPosition,
          purchasedAt: nextStatus === 'purchased' ? now : undefined,
          updatedAt: now,
        };

        const optimisticCategories = replaceItem(stateSnapshot.categories, optimisticItem);
        const optimisticDerived = deriveStateFromCategories(
          optimisticCategories,
          stateSnapshot.list,
          stateSnapshot.filters,
        );

        set((state) => ({
          ...state,
          ...optimisticDerived,
          lastError: null,
        }));

        try {
          const saved = await toggleItemPurchased(itemId, { repository });
          set((state) => {
            const categoriesAfterSave = replaceItem(state.categories, saved);
            const derivedAfterSave = deriveStateFromCategories(
              categoriesAfterSave,
              state.list,
              state.filters,
            );
            return {
              ...state,
              ...derivedAfterSave,
            };
          });
        } catch (error) {
          console.debug('shoppingListStore.toggle_item_failed', { error });
          set((state) => ({
            ...state,
            ...stateSnapshot,
            lastError: {
              type: 'write',
              message: error instanceof Error ? error.message : 'toggle_failed',
            },
          }));
        }
      },

      updateItem: async (input: UpdateItemInput) => {
        const stateSnapshot = snapshotState(get());
        const existing = findItem(stateSnapshot.categories, input.itemId);
        if (!existing) {
          set((state) => ({
            ...state,
            lastError: { type: 'write', message: 'item_not_found' },
          }));
          return null;
        }

        try {
          const updated = await updateItemUseCase(input, { repository });
          set((state) => {
            const categoriesAfterUpdate = replaceItem(state.categories, updated);
            const derivedAfterUpdate = deriveStateFromCategories(
              categoriesAfterUpdate,
              state.list,
              state.filters,
            );
            return {
              ...state,
              ...derivedAfterUpdate,
              lastError: null,
            };
          });
          return updated;
        } catch (error) {
          console.debug('shoppingListStore.update_item_failed', { error });
          set((state) => ({
            ...state,
            ...stateSnapshot,
            lastError: {
              type: 'write',
              message: error instanceof Error ? error.message : 'update_failed',
            },
          }));
          return null;
        }
      },

      removeItem: async (itemId: string) => {
        const stateSnapshot = snapshotState(get());
        const target = findItem(stateSnapshot.categories, itemId);
        if (!target) {
          set((state) => ({
            ...state,
            lastError: { type: 'write', message: 'item_not_found' },
          }));
          return;
        }

        const optimisticCategories = removeItemFromCategories(stateSnapshot.categories, itemId);
        const optimisticDerived = deriveStateFromCategories(
          optimisticCategories,
          stateSnapshot.list,
          stateSnapshot.filters,
        );

        set((state) => ({
          ...state,
          ...optimisticDerived,
          pendingUndo: target,
          lastError: null,
        }));

        try {
          await deleteItemUseCase(itemId, { repository });
        } catch (error) {
          console.debug('shoppingListStore.delete_item_failed', { error });
          set((state) => ({
            ...state,
            ...stateSnapshot,
            lastError: {
              type: 'write',
              message: error instanceof Error ? error.message : 'delete_failed',
            },
            pendingUndo: undefined,
          }));
        }
      },

      undoRemove: async () => {
        const undoItem = get().pendingUndo;
        if (!undoItem) {
          return;
        }

        const stateSnapshot = snapshotState(get());
        const optimisticCategories = insertItem(stateSnapshot.categories, undoItem);
        const optimisticSummary = deriveStateFromCategories(
          optimisticCategories,
          stateSnapshot.list,
          stateSnapshot.filters,
        );

        set((state) => ({
          ...state,
          ...optimisticSummary,
          pendingUndo: undefined,
        }));

        try {
          await repository.upsertItem(undoItem);
        } catch (error) {
          console.debug('shoppingListStore.undo_remove_failed', { error });
          set((state) => ({
            ...state,
            ...stateSnapshot,
            lastError: {
              type: 'write',
              message: error instanceof Error ? error.message : 'undo_failed',
            },
          }));
        }
      },

      setSearchQuery: (query: string) => {
        const nextFilters: ShoppingListFilters = {
          ...get().filters,
          query,
        };
        set((state) => ({
          ...state,
          filters: nextFilters,
          visibleCategories: filterCategories(state.categories, nextFilters),
        }));
      },

      toggleHidePurchased: async () => {
        const current = get();
        if (!current.list) {
          set((state) => ({
            ...state,
            lastError: { type: 'load', message: 'missing_list' },
          }));
          return;
        }

        const nextHidePurchased = !current.filters.hidePurchased;
        const optimisticFilters: ShoppingListFilters = {
          ...current.filters,
          hidePurchased: nextHidePurchased,
        };
        const snapshot = snapshotState(current);
        const optimisticDerived = deriveStateFromCategories(
          current.categories,
          current.list,
          optimisticFilters,
        );

        set((state) => ({
          ...state,
          ...optimisticDerived,
          filters: optimisticFilters,
        }));

        try {
          const updatedList = await updatePreferences(
            { listId: current.list.id, hidePurchasedByDefault: nextHidePurchased },
            { repository },
          );
          const syncedFilters = resolveFiltersFromList(updatedList, optimisticFilters);
          const derived = deriveStateFromCategories(get().categories, updatedList, syncedFilters);
          set((state) => ({
            ...state,
            ...derived,
            list: updatedList,
            filters: syncedFilters,
            lastError: null,
          }));
        } catch (error) {
          console.debug('shoppingListStore.toggle_hide_failed', { error });
          set((state) => ({
            ...state,
            ...snapshot,
            lastError: {
              type: 'write',
              message: error instanceof Error ? error.message : 'preferences_failed',
            },
          }));
        }
      },

      clearError: () => {
        set((state) => ({
          ...state,
          lastError: null,
        }));
      },

      dismissUndo: () => {
        set((state) => ({
          ...state,
          pendingUndo: undefined,
        }));
      },
    },
  }));
}

function resolveFiltersFromList(
  list: ShoppingList | null,
  currentFilters: ShoppingListFilters,
): ShoppingListFilters {
  return {
    query: currentFilters.query,
    hidePurchased: list?.hidePurchasedByDefault ?? currentFilters.hidePurchased,
  };
}

function deriveStateFromCategories(
  categories: CategoryItems[],
  list: ShoppingList | null,
  filters: ShoppingListFilters,
): Pick<ShoppingListState, 'categories' | 'visibleCategories' | 'totals' | 'monetaryTotals'> {
  const summary = recomputeSummaryFromCategories(categories, list);
  return {
    categories,
    visibleCategories: filterCategories(categories, filters),
    totals: summary.totals,
    monetaryTotals: summary.monetaryTotals,
  };
}

function filterCategories(
  categories: CategoryItems[],
  filters: ShoppingListFilters,
): CategoryItems[] {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase();

  return categories
    .map((category) => {
      const pending = filterItems(category.items.pending, normalizedQuery);
      const purchased = filters.hidePurchased
        ? []
        : filterItems(category.items.purchased, normalizedQuery);

      if (pending.length === 0 && purchased.length === 0) {
        return null;
      }

      return {
        ...category,
        items: {
          pending,
          purchased,
        },
      };
    })
    .filter((category): category is CategoryItems => Boolean(category));
}

function filterItems(items: ShoppingItem[], normalizedQuery: string): ShoppingItem[] {
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => item.name.toLocaleLowerCase().includes(normalizedQuery));
}

function buildPreview(text: string, locale: string): CreateItemFromFreeTextResult | null {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return createItemFromFreeText(trimmed, { locale, defaultCategory: DEFAULT_CATEGORY_CODE });
  } catch (error) {
    if (error instanceof EmptyItemNameError) {
      return null;
    }
    console.debug('shoppingListStore.preview_failed', { error });
    return null;
  }
}

function snapshotState(
  state: ShoppingListStore,
): Pick<
  ShoppingListStore,
  | 'categories'
  | 'visibleCategories'
  | 'totals'
  | 'monetaryTotals'
  | 'inputText'
  | 'preview'
  | 'list'
  | 'filters'
> {
  return {
    categories: state.categories,
    visibleCategories: state.visibleCategories,
    totals: state.totals,
    monetaryTotals: state.monetaryTotals,
    inputText: state.inputText,
    preview: state.preview,
    list: state.list,
    filters: state.filters,
  };
}

function findCategoryByName(
  categories: CategoryItems[],
  name: string | undefined,
): CategoryItems | undefined {
  if (!name) {
    return undefined;
  }
  const normalized = name.trim().toLowerCase();
  return categories.find((category) => category.name.trim().toLowerCase() === normalized);
}

function computeNextPosition(
  categories: CategoryItems[],
  categoryId: string,
  status: ShoppingItemStatus,
  excludeItemId?: string,
): number {
  const category = categories.find((candidate) => candidate.id === categoryId);
  if (!category) {
    return 1;
  }

  const items = status === 'purchased' ? category.items.purchased : category.items.pending;
  const positions = items
    .filter((item) => item.id !== excludeItemId)
    .map((item) => item.position)
    .filter((value) => Number.isFinite(value));

  const maxPosition = positions.length ? Math.max(...positions) : 0;
  return maxPosition + 1;
}

function computeNextSortOrder(categories: CategoryItems[]): number {
  if (!categories.length) {
    return 1;
  }
  const maxSortOrder = Math.max(...categories.map((category) => category.sortOrder));
  return maxSortOrder + 1;
}

function insertItem(
  categories: CategoryItems[],
  item: ShoppingItem,
  categoryOverride?: Category,
): CategoryItems[] {
  const existingCategoryIndex = categories.findIndex((category) => category.id === item.categoryId);
  let nextCategories: CategoryItems[];
  if (existingCategoryIndex === -1) {
    const newCategory: CategoryItems = {
      id: item.categoryId,
      name: categoryOverride?.name ?? DEFAULT_CATEGORY_CODE,
      isPredefined: categoryOverride?.isPredefined ?? false,
      sortOrder: categoryOverride?.sortOrder ?? computeNextSortOrder(categories),
      items: { pending: [], purchased: [] },
    };
    nextCategories = [...categories, newCategory];
  } else {
    nextCategories = categories.map((category, index) =>
      index === existingCategoryIndex
        ? {
            ...category,
            items: {
              pending: [...category.items.pending],
              purchased: [...category.items.purchased],
            },
          }
        : category,
    );
  }

  const targetIndex = nextCategories.findIndex((category) => category.id === item.categoryId);
  const target = nextCategories[targetIndex];
  const groupKey = item.status === 'purchased' ? 'purchased' : 'pending';
  const group = target.items[groupKey].filter((candidate) => candidate.id !== item.id);
  const updatedGroup = [...group, item].sort((a, b) => a.position - b.position);

  const updatedCategory: CategoryItems = {
    ...target,
    items: {
      ...target.items,
      [groupKey]: updatedGroup,
    },
  };

  nextCategories[targetIndex] = updatedCategory;
  return sortCategories(nextCategories);
}

function replaceItem(categories: CategoryItems[], item: ShoppingItem): CategoryItems[] {
  const withoutItem = removeItemFromCategories(categories, item.id);
  return insertItem(withoutItem, item);
}

function removeItemFromCategories(categories: CategoryItems[], itemId: string): CategoryItems[] {
  return categories.map((category) => ({
    ...category,
    items: {
      pending: category.items.pending.filter((item) => item.id !== itemId),
      purchased: category.items.purchased.filter((item) => item.id !== itemId),
    },
  }));
}

function sortCategories(categories: CategoryItems[]): CategoryItems[] {
  return [...categories].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return a.name.localeCompare(b.name);
  });
}

function recomputeSummaryFromCategories(
  categories: CategoryItems[],
  list: ShoppingList | null,
): Pick<ShoppingListState, 'totals' | 'monetaryTotals'> {
  if (!list) {
    return {
      totals: recomputeTotals(categories),
      monetaryTotals: undefined,
    };
  }

  const summary = computeListSummary(collectItems(categories), list.currencyCode);
  return {
    totals: summary.counts,
    monetaryTotals: summary.monetary,
  };
}

function collectItems(categories: CategoryItems[]): ShoppingItem[] {
  const items: ShoppingItem[] = [];
  for (const category of categories) {
    items.push(...category.items.pending, ...category.items.purchased);
  }
  return items;
}

function recomputeTotals(categories: CategoryItems[]): ShoppingListState['totals'] {
  let pendingItems = 0;
  let purchasedItems = 0;

  for (const category of categories) {
    pendingItems += category.items.pending.length;
    purchasedItems += category.items.purchased.length;
  }

  return {
    totalItems: pendingItems + purchasedItems,
    pendingItems,
    purchasedItems,
  };
}

function findItem(categories: CategoryItems[], itemId: string): ShoppingItem | undefined {
  for (const category of categories) {
    const pendingMatch = category.items.pending.find((item) => item.id === itemId);
    if (pendingMatch) {
      return pendingMatch;
    }
    const purchasedMatch = category.items.purchased.find((item) => item.id === itemId);
    if (purchasedMatch) {
      return purchasedMatch;
    }
  }
  return undefined;
}

function generateId(): string {
  if (
    typeof crypto !== 'undefined' &&
    'randomUUID' in crypto &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
