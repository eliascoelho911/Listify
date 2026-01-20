import type { CreateListInput, List, ListType, UpdateListInput } from '@domain/list';
import type { CreateListRow, ListRow, UpdateListRow } from '../persistence';

/**
 * Convert SQLite row to domain List entity
 */
export function toDomainList(row: ListRow): List {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    listType: row.list_type as ListType,
    isPrefabricated: row.is_prefabricated === 1,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  } as List;
}

/**
 * Convert domain CreateListInput to SQLite row for insertion
 */
export function toCreateListRow(input: CreateListInput, id: string): CreateListRow {
  const now = Date.now();
  return {
    id,
    name: input.name,
    description: input.description ?? null,
    list_type: input.listType,
    is_prefabricated: input.isPrefabricated ? 1 : 0,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Convert domain UpdateListInput to partial SQLite row for update
 */
export function toUpdateListRow(updates: UpdateListInput): UpdateListRow {
  return {
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.description !== undefined && { description: updates.description ?? null }),
    updated_at: Date.now(),
  };
}
