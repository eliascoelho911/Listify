/**
 * Persistence contract for Item entity.
 * Defines the row type that SQLite/Drizzle must produce.
 */
export interface ItemRow {
  id: string;
  list_id: string | null;
  section_id: string | null;
  title: string;
  type: string;
  sort_order: number;
  description: string | null;
  quantity: string | null;
  price: number | null;
  is_checked: number | null; // SQLite boolean = 0/1
  external_id: string | null;
  metadata: string | null; // JSON string
  created_at: number; // timestamp ms
  updated_at: number; // timestamp ms
}

export interface CreateItemRow {
  id: string;
  list_id: string | null;
  section_id: string | null;
  title: string;
  type: string;
  sort_order: number;
  description: string | null;
  quantity: string | null;
  price: number | null;
  is_checked: number | null;
  external_id: string | null;
  metadata: string | null;
  created_at: number;
  updated_at: number;
}

export interface UpdateItemRow {
  list_id?: string | null;
  section_id?: string | null;
  title?: string;
  sort_order?: number;
  description?: string | null;
  quantity?: string | null;
  price?: number | null;
  is_checked?: number | null;
  external_id?: string | null;
  metadata?: string | null;
  updated_at: number;
}
