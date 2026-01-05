import type { Category } from '@domain/shopping/entities/Category';
import type { ShoppingItem } from '@domain/shopping/entities/ShoppingItem';
import type { ShoppingList } from '@domain/shopping/entities/ShoppingList';
import { Quantity } from '@domain/shopping/value-objects/Quantity';
import { Unit } from '@domain/shopping/value-objects/Unit';

export type ShoppingListRow = {
  id: string;
  created_at: string;
  updated_at: string;
  currency_code: string;
  is_completed: number;
  completed_at: string | null;
  hide_purchased_by_default: number;
  ask_price_on_purchase: number;
};

export type CategoryRow = {
  id: string;
  name: string;
  is_predefined: number;
  sort_order: number;
};

export type ItemRow = {
  id: string;
  list_id: string;
  name: string;
  quantity_num: string;
  unit: string;
  category_id: string;
  status: string;
  position: number;
  created_at: string;
  updated_at: string;
  purchased_at: string | null;
  unit_price_minor: number | null;
  total_price_minor: number | null;
};

export function mapListRowToEntity(row: ShoppingListRow): ShoppingList {
  return {
    id: row.id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    currencyCode: row.currency_code,
    isCompleted: row.is_completed === 1,
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    hidePurchasedByDefault: row.hide_purchased_by_default === 1,
    askPriceOnPurchase: row.ask_price_on_purchase === 1,
  };
}

export function mapCategoryRowToEntity(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    isPredefined: row.is_predefined === 1,
    sortOrder: row.sort_order,
  };
}

export function mapItemRowToEntity(row: ItemRow): ShoppingItem {
  return {
    id: row.id,
    listId: row.list_id,
    name: row.name,
    quantity: Quantity.parse(row.quantity_num),
    unit: Unit.parse(row.unit).value,
    categoryId: row.category_id,
    status: row.status === 'purchased' ? 'purchased' : 'pending',
    position: row.position,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    purchasedAt: row.purchased_at ? new Date(row.purchased_at) : undefined,
    unitPriceMinor: row.unit_price_minor === null ? undefined : row.unit_price_minor,
    totalPriceMinor: row.total_price_minor === null ? undefined : row.total_price_minor,
  };
}

export function mapCategoryEntityToRow(category: Category): CategoryRow {
  return {
    id: category.id,
    name: category.name,
    is_predefined: category.isPredefined ? 1 : 0,
    sort_order: category.sortOrder,
  };
}

export function mapItemEntityToRow(item: ShoppingItem): ItemRow {
  return {
    id: item.id,
    list_id: item.listId,
    name: item.name,
    quantity_num: item.quantity.toString(),
    unit: item.unit,
    category_id: item.categoryId,
    status: item.status,
    position: item.position,
    created_at: item.createdAt.toISOString(),
    updated_at: item.updatedAt.toISOString(),
    purchased_at: item.purchasedAt ? item.purchasedAt.toISOString() : null,
    unit_price_minor: item.unitPriceMinor ?? null,
    total_price_minor: item.totalPriceMinor ?? null,
  };
}
