import type { Tag, UserInput } from '@domain/inbox/entities';

import type { TagRow, UserInputRow } from './types';

/**
 * Maps a UserInputRow from SQLite to a UserInput domain entity.
 *
 * @param row - The SQLite row
 * @param tags - Tags associated with this input
 * @returns UserInput domain entity
 */
export function mapUserInputRowToEntity(row: UserInputRow, tags: Tag[]): UserInput {
  return {
    id: row.id,
    text: row.text,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    tags,
  };
}

/**
 * Maps a UserInput domain entity to a SQLite row.
 *
 * @param input - The domain entity
 * @returns UserInputRow for SQLite
 */
export function mapUserInputEntityToRow(input: UserInput): UserInputRow {
  return {
    id: input.id,
    text: input.text,
    created_at: input.createdAt.toISOString(),
    updated_at: input.updatedAt.toISOString(),
  };
}

/**
 * Maps a TagRow from SQLite to a Tag domain entity.
 *
 * @param row - The SQLite row
 * @returns Tag domain entity
 */
export function mapTagRowToEntity(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    usageCount: row.usage_count,
    createdAt: new Date(row.created_at),
  };
}

/**
 * Maps a Tag domain entity to a SQLite row.
 *
 * @param tag - The domain entity
 * @returns TagRow for SQLite
 */
export function mapTagEntityToRow(tag: Tag): TagRow {
  return {
    id: tag.id,
    name: tag.name,
    usage_count: tag.usageCount,
    created_at: tag.createdAt.toISOString(),
  };
}
