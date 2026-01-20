/**
 * Persistence contract for PurchaseHistory entity.
 * Defines the row type that SQLite/Drizzle must produce.
 */
export interface PurchaseHistoryRow {
  id: string;
  list_id: string;
  purchase_date: number; // timestamp ms
  total_value: number;
  sections: string; // JSON string
  items: string; // JSON string
  created_at: number; // timestamp ms
  updated_at: number; // timestamp ms
}

export interface CreatePurchaseHistoryRow {
  id: string;
  list_id: string;
  purchase_date: number;
  total_value: number;
  sections: string;
  items: string;
  created_at: number;
  updated_at: number;
}
