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

export const MIGRATIONS: Migration[] = [
  {
    id: 1,
    name: '0001_init',
    sql: INIT_SCHEMA,
  },
];
