export type Migration = {
  id: number;
  name: string;
  sql: string;
};

const INIT_SCHEMA = `-- Schema inicial do Listify (v1.0)
CREATE TABLE IF NOT EXISTS lists (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  is_completed INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  hide_purchased_by_default INTEGER NOT NULL DEFAULT 0,
  ask_price_on_purchase INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL COLLATE NOCASE,
  is_predefined INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_name_unique ON categories(name);

CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY NOT NULL,
  list_id TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity_num TEXT NOT NULL,
  unit TEXT NOT NULL,
  category_id TEXT NOT NULL,
  status TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  purchased_at TEXT,
  unit_price_minor INTEGER,
  total_price_minor INTEGER,
  FOREIGN KEY(list_id) REFERENCES lists(id),
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS idx_items_list_category ON items(list_id, category_id);
CREATE INDEX IF NOT EXISTS idx_items_list_status ON items(list_id, status);
CREATE INDEX IF NOT EXISTS idx_items_list_name ON items(list_id, name);`;

const INBOX_SCHEMA = `-- Schema Inbox (v2.0)
-- Tabela principal de inputs
CREATE TABLE IF NOT EXISTS user_inputs (
  id TEXT PRIMARY KEY NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Índice para ordenação cronológica (scroll infinito)
CREATE INDEX IF NOT EXISTS idx_user_inputs_created ON user_inputs(created_at);

-- Tabela de tags
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL COLLATE NOCASE,
  usage_count INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

-- Índice único para evitar tags duplicadas (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- Junction table para relação N:N
CREATE TABLE IF NOT EXISTS input_tags (
  input_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (input_id, tag_id),
  FOREIGN KEY (input_id) REFERENCES user_inputs(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Índices para queries eficientes
CREATE INDEX IF NOT EXISTS idx_input_tags_input ON input_tags(input_id);
CREATE INDEX IF NOT EXISTS idx_input_tags_tag ON input_tags(tag_id);`;

export const MIGRATIONS: Migration[] = [
  {
    id: 1,
    name: '0001_init',
    sql: INIT_SCHEMA,
  },
  {
    id: 2,
    name: '0002_inbox',
    sql: INBOX_SCHEMA,
  },
];
