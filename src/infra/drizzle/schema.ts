import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

// ============================================
// LISTS
// ============================================
export const lists = sqliteTable(
  'lists',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    listType: text('list_type').notNull(), // 'notes' | 'shopping' | 'movies' | 'books' | 'games'
    isPrefabricated: integer('is_prefabricated', { mode: 'boolean' }).default(false).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('lists_list_type_idx').on(table.listType),
    uniqueIndex('lists_name_type_unique').on(table.name, table.listType),
  ],
);

// ============================================
// SECTIONS
// ============================================
export const sections = sqliteTable(
  'sections',
  {
    id: text('id').primaryKey(),
    listId: text('list_id')
      .notNull()
      .references(() => lists.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('sections_list_id_idx').on(table.listId),
    uniqueIndex('sections_list_name_unique').on(table.listId, table.name),
  ],
);

// ============================================
// ITEMS
// ============================================
export const items = sqliteTable(
  'items',
  {
    id: text('id').primaryKey(),
    listId: text('list_id').references(() => lists.id, { onDelete: 'set null' }),
    sectionId: text('section_id').references(() => sections.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    type: text('type').notNull(), // 'note' | 'shopping' | 'movie' | 'book' | 'game'
    sortOrder: integer('sort_order').notNull().default(0),
    // Note fields
    description: text('description'),
    // Shopping fields
    quantity: text('quantity'),
    price: real('price'),
    isChecked: integer('is_checked', { mode: 'boolean' }).default(false),
    // Interest fields
    externalId: text('external_id'),
    metadata: text('metadata', { mode: 'json' }), // JSON string
    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('items_list_id_idx').on(table.listId),
    index('items_section_id_idx').on(table.sectionId),
    index('items_type_idx').on(table.type),
    index('items_created_at_idx').on(table.createdAt),
    index('items_title_idx').on(table.title),
  ],
);

// ============================================
// USERS
// ============================================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  photoUrl: text('photo_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ============================================
// USER PREFERENCES
// ============================================
export const userPreferences = sqliteTable(
  'user_preferences',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    theme: text('theme').notNull().default('dark'), // 'light' | 'dark' | 'auto'
    primaryColor: text('primary_color'),
    layoutConfigs: text('layout_configs', { mode: 'json' }).notNull().default('{}'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [uniqueIndex('user_preferences_user_id_unique').on(table.userId)],
);

// ============================================
// PURCHASE HISTORY
// ============================================
export const purchaseHistory = sqliteTable(
  'purchase_history',
  {
    id: text('id').primaryKey(),
    listId: text('list_id')
      .notNull()
      .references(() => lists.id, { onDelete: 'cascade' }),
    purchaseDate: integer('purchase_date', { mode: 'timestamp' }).notNull(),
    totalValue: real('total_value').notNull().default(0),
    sections: text('sections', { mode: 'json' }).notNull().default('[]'),
    items: text('items', { mode: 'json' }).notNull().default('[]'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('purchase_history_list_id_idx').on(table.listId),
    index('purchase_history_purchase_date_idx').on(table.purchaseDate),
  ],
);

// ============================================
// SEARCH HISTORY
// ============================================
export const searchHistory = sqliteTable(
  'search_history',
  {
    id: text('id').primaryKey(),
    query: text('query').notNull(),
    searchedAt: integer('searched_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    uniqueIndex('search_history_query_unique').on(table.query),
    index('search_history_searched_at_idx').on(table.searchedAt),
  ],
);
