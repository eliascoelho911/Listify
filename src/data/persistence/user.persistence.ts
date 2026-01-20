/**
 * Persistence contract for User entity.
 * Defines the row type that SQLite/Drizzle must produce.
 */
export interface UserRow {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
  created_at: number; // timestamp ms
  updated_at: number; // timestamp ms
}

export interface CreateUserRow {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
  created_at: number;
  updated_at: number;
}

export interface UpdateUserRow {
  name?: string;
  email?: string;
  photo_url?: string | null;
  updated_at: number;
}
