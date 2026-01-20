/**
 * Persistence contract for List entity.
 * Defines the row type that SQLite/Drizzle must produce.
 */
export interface ListRow {
  id: string;
  name: string;
  description: string | null;
  list_type: string;
  is_prefabricated: number; // SQLite boolean = 0/1
  created_at: number; // timestamp ms
  updated_at: number; // timestamp ms
}

export interface CreateListRow {
  id: string;
  name: string;
  description: string | null;
  list_type: string;
  is_prefabricated: number;
  created_at: number;
  updated_at: number;
}

export interface UpdateListRow {
  name?: string;
  description?: string | null;
  updated_at: number;
}
