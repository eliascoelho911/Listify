/**
 * Persistence contract for Section entity.
 * Defines the row type that SQLite/Drizzle must produce.
 */
export interface SectionRow {
  id: string;
  list_id: string;
  name: string;
  sort_order: number;
  created_at: number; // timestamp ms
  updated_at: number; // timestamp ms
}

export interface CreateSectionRow {
  id: string;
  list_id: string;
  name: string;
  sort_order: number;
  created_at: number;
  updated_at: number;
}

export interface UpdateSectionRow {
  name?: string;
  sort_order?: number;
  updated_at: number;
}
