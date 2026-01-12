/**
 * SQLite row types for Inbox domain (snake_case).
 * These types represent the raw data as stored in SQLite.
 */

/**
 * Row type for user_inputs table.
 */
export type UserInputRow = {
  id: string;
  text: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
};

/**
 * Row type for tags table.
 */
export type TagRow = {
  id: string;
  name: string;
  usage_count: number;
  created_at: string; // ISO 8601
};

/**
 * Row type for input_tags junction table.
 */
export type InputTagRow = {
  input_id: string;
  tag_id: string;
};
