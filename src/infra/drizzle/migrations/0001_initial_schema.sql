-- 0001_initial_schema.sql
-- Initial schema for Listify Core

-- ============================================
-- LISTS
-- ============================================
CREATE TABLE IF NOT EXISTS lists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  list_type TEXT NOT NULL,
  is_prefabricated INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS lists_list_type_idx ON lists(list_type);
CREATE UNIQUE INDEX IF NOT EXISTS lists_name_type_unique ON lists(name, list_type);

-- ============================================
-- SECTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS sections_list_id_idx ON sections(list_id);
CREATE UNIQUE INDEX IF NOT EXISTS sections_list_name_unique ON sections(list_id, name);

-- ============================================
-- ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  list_id TEXT REFERENCES lists(id) ON DELETE SET NULL,
  section_id TEXT REFERENCES sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  quantity TEXT,
  price REAL,
  is_checked INTEGER DEFAULT 0,
  external_id TEXT,
  metadata TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS items_list_id_idx ON items(list_id);
CREATE INDEX IF NOT EXISTS items_section_id_idx ON items(section_id);
CREATE INDEX IF NOT EXISTS items_type_idx ON items(type);
CREATE INDEX IF NOT EXISTS items_created_at_idx ON items(created_at);
CREATE INDEX IF NOT EXISTS items_title_idx ON items(title);

-- ============================================
-- USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  photo_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- ============================================
-- USER PREFERENCES
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'dark',
  primary_color TEXT,
  layout_configs TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS user_preferences_user_id_unique ON user_preferences(user_id);

-- ============================================
-- PURCHASE HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_history (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  purchase_date INTEGER NOT NULL,
  total_value REAL NOT NULL DEFAULT 0,
  sections TEXT NOT NULL DEFAULT '[]',
  items TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS purchase_history_list_id_idx ON purchase_history(list_id);
CREATE INDEX IF NOT EXISTS purchase_history_purchase_date_idx ON purchase_history(purchase_date);

-- ============================================
-- SEARCH HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS search_history (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  searched_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS search_history_query_unique ON search_history(query);
CREATE INDEX IF NOT EXISTS search_history_searched_at_idx ON search_history(searched_at);
