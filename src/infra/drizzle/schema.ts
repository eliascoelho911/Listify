import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

/**
 * user_inputs table - stores user text inputs
 * Matches existing SQL schema from migrations/index.ts
 */
export const userInputs = sqliteTable(
  'user_inputs',
  {
    id: text('id').primaryKey().notNull(),
    text: text('text').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [index('idx_user_inputs_created').on(table.createdAt)],
);

/**
 * tags table - stores extracted tags with usage tracking
 * Matches existing SQL schema from migrations/index.ts
 */
export const tags = sqliteTable(
  'tags',
  {
    id: text('id').primaryKey().notNull(),
    name: text('name').notNull(),
    usageCount: integer('usage_count').notNull().default(1),
    createdAt: text('created_at').notNull(),
  },
  (table) => [uniqueIndex('idx_tags_name').on(table.name)],
);

/**
 * input_tags junction table - N:N relationship between user_inputs and tags
 * Matches existing SQL schema from migrations/index.ts
 */
export const inputTags = sqliteTable(
  'input_tags',
  {
    inputId: text('input_id')
      .notNull()
      .references(() => userInputs.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.inputId, table.tagId] }),
    index('idx_input_tags_input').on(table.inputId),
    index('idx_input_tags_tag').on(table.tagId),
  ],
);

/**
 * Relations for relational queries
 */
export const userInputsRelations = relations(userInputs, ({ many }) => ({
  inputTags: many(inputTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  inputTags: many(inputTags),
}));

export const inputTagsRelations = relations(inputTags, ({ one }) => ({
  userInput: one(userInputs, {
    fields: [inputTags.inputId],
    references: [userInputs.id],
  }),
  tag: one(tags, {
    fields: [inputTags.tagId],
    references: [tags.id],
  }),
}));

/**
 * Type exports for use in mutations and queries
 */
export type UserInputRow = typeof userInputs.$inferSelect;
export type NewUserInputRow = typeof userInputs.$inferInsert;

export type TagRow = typeof tags.$inferSelect;
export type NewTagRow = typeof tags.$inferInsert;

export type InputTagRow = typeof inputTags.$inferSelect;
export type NewInputTagRow = typeof inputTags.$inferInsert;
