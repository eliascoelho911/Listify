import type { CreateSectionInput, Section, UpdateSectionInput } from '@domain/section';

import type { CreateSectionRow, SectionRow, UpdateSectionRow } from '../persistence';

/**
 * Convert SQLite row to domain Section entity
 */
export function toDomainSection(row: SectionRow): Section {
  return {
    id: row.id,
    listId: row.list_id,
    name: row.name,
    sortOrder: row.sort_order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Convert domain CreateSectionInput to SQLite row for insertion
 */
export function toCreateSectionRow(input: CreateSectionInput, id: string): CreateSectionRow {
  const now = Date.now();
  return {
    id,
    list_id: input.listId,
    name: input.name,
    sort_order: input.sortOrder,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Convert domain UpdateSectionInput to partial SQLite row for update
 */
export function toUpdateSectionRow(updates: UpdateSectionInput): UpdateSectionRow {
  return {
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.sortOrder !== undefined && { sort_order: updates.sortOrder }),
    updated_at: Date.now(),
  };
}
