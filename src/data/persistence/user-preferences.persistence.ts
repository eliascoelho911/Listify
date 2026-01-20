/**
 * Persistence contract for UserPreferences entity.
 * Defines the row type that SQLite/Drizzle must produce.
 */
export interface UserPreferencesRow {
  id: string;
  user_id: string;
  theme: string;
  primary_color: string | null;
  layout_configs: string; // JSON string
  created_at: number; // timestamp ms
  updated_at: number; // timestamp ms
}

export interface CreateUserPreferencesRow {
  id: string;
  user_id: string;
  theme: string;
  primary_color: string | null;
  layout_configs: string;
  created_at: number;
  updated_at: number;
}

export interface UpdateUserPreferencesRow {
  theme?: string;
  primary_color?: string | null;
  layout_configs?: string;
  updated_at: number;
}
