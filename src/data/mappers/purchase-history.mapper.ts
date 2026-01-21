import type {
  CreatePurchaseHistoryInput,
  PurchaseHistory,
  PurchaseHistoryItem,
  PurchaseHistorySection,
} from '@domain/purchase-history';

import type { CreatePurchaseHistoryRow, PurchaseHistoryRow } from '../persistence';

/**
 * Convert SQLite row to domain PurchaseHistory entity
 */
export function toDomainPurchaseHistory(row: PurchaseHistoryRow): PurchaseHistory {
  return {
    id: row.id,
    listId: row.list_id,
    purchaseDate: new Date(row.purchase_date),
    totalValue: row.total_value,
    sections: JSON.parse(row.sections) as PurchaseHistorySection[],
    items: JSON.parse(row.items) as PurchaseHistoryItem[],
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Convert domain CreatePurchaseHistoryInput to SQLite row for insertion
 */
export function toCreatePurchaseHistoryRow(
  input: CreatePurchaseHistoryInput,
  id: string,
): CreatePurchaseHistoryRow {
  const now = Date.now();
  return {
    id,
    list_id: input.listId,
    purchase_date: input.purchaseDate.getTime(),
    total_value: input.totalValue,
    sections: JSON.stringify(input.sections),
    items: JSON.stringify(input.items),
    created_at: now,
    updated_at: now,
  };
}
