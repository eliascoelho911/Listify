import type {
  BookItem,
  BookMetadata,
  CreateItemInput,
  GameItem,
  GameMetadata,
  Item,
  ItemType,
  MovieItem,
  MovieMetadata,
  NoteItem,
  ShoppingItem,
  UpdateItemInput,
} from '@domain/item';

import type { CreateItemRow, ItemRow, UpdateItemRow } from '../persistence';

/**
 * Convert SQLite row to domain Item entity (discriminated union)
 */
export function toDomainItem(row: ItemRow): Item {
  const base = {
    id: row.id,
    listId: row.list_id ?? undefined,
    sectionId: row.section_id ?? undefined,
    title: row.title,
    sortOrder: row.sort_order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };

  const type = row.type as ItemType;

  switch (type) {
    case 'note':
      return {
        ...base,
        type: 'note',
        description: row.description ?? undefined,
      } as NoteItem;

    case 'shopping':
      return {
        ...base,
        type: 'shopping',
        quantity: row.quantity ?? undefined,
        price: row.price ?? undefined,
        isChecked: row.is_checked === 1,
      } as ShoppingItem;

    case 'movie':
      return {
        ...base,
        type: 'movie',
        externalId: row.external_id ?? undefined,
        metadata: row.metadata ? (JSON.parse(row.metadata) as MovieMetadata) : undefined,
        isChecked: row.is_checked === 1,
      } as MovieItem;

    case 'book':
      return {
        ...base,
        type: 'book',
        externalId: row.external_id ?? undefined,
        metadata: row.metadata ? (JSON.parse(row.metadata) as BookMetadata) : undefined,
        isChecked: row.is_checked === 1,
      } as BookItem;

    case 'game':
      return {
        ...base,
        type: 'game',
        externalId: row.external_id ?? undefined,
        metadata: row.metadata ? (JSON.parse(row.metadata) as GameMetadata) : undefined,
        isChecked: row.is_checked === 1,
      } as GameItem;

    default:
      throw new Error(`Unknown item type: ${type}`);
  }
}

/**
 * Convert SQLite row to domain NoteItem specifically
 */
export function toDomainNoteItem(row: ItemRow): NoteItem {
  return toDomainItem(row) as NoteItem;
}

/**
 * Convert SQLite row to domain ShoppingItem specifically
 */
export function toDomainShoppingItem(row: ItemRow): ShoppingItem {
  return toDomainItem(row) as ShoppingItem;
}

/**
 * Convert SQLite row to domain MovieItem specifically
 */
export function toDomainMovieItem(row: ItemRow): MovieItem {
  return toDomainItem(row) as MovieItem;
}

/**
 * Convert SQLite row to domain BookItem specifically
 */
export function toDomainBookItem(row: ItemRow): BookItem {
  return toDomainItem(row) as BookItem;
}

/**
 * Convert SQLite row to domain GameItem specifically
 */
export function toDomainGameItem(row: ItemRow): GameItem {
  return toDomainItem(row) as GameItem;
}

/**
 * Convert domain CreateItemInput to SQLite row for insertion
 */
export function toCreateItemRow(input: CreateItemInput, id: string): CreateItemRow {
  const now = Date.now();

  const base: CreateItemRow = {
    id,
    list_id: input.listId ?? null,
    section_id: input.sectionId ?? null,
    title: input.title,
    type: input.type,
    sort_order: input.sortOrder,
    description: null,
    quantity: null,
    price: null,
    is_checked: null,
    external_id: null,
    metadata: null,
    created_at: now,
    updated_at: now,
  };

  switch (input.type) {
    case 'note':
      return {
        ...base,
        description: input.description ?? null,
      };

    case 'shopping':
      return {
        ...base,
        quantity: input.quantity ?? null,
        price: input.price ?? null,
        is_checked: input.isChecked === undefined ? null : input.isChecked ? 1 : 0,
      };

    case 'movie':
    case 'book':
    case 'game':
      return {
        ...base,
        external_id: input.externalId ?? null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        is_checked: input.isChecked === undefined ? null : input.isChecked ? 1 : 0,
      };

    default:
      return base;
  }
}

/**
 * Convert domain UpdateItemInput to partial SQLite row for update
 */
export function toUpdateItemRow(updates: UpdateItemInput): UpdateItemRow {
  const row: UpdateItemRow = {
    updated_at: Date.now(),
  };

  if ('title' in updates && updates.title !== undefined) {
    row.title = updates.title;
  }
  if ('listId' in updates && updates.listId !== undefined) {
    row.list_id = updates.listId ?? null;
  }
  if ('sectionId' in updates && updates.sectionId !== undefined) {
    row.section_id = updates.sectionId ?? null;
  }
  if ('sortOrder' in updates && updates.sortOrder !== undefined) {
    row.sort_order = updates.sortOrder;
  }
  if ('description' in updates && updates.description !== undefined) {
    row.description = updates.description ?? null;
  }
  if ('quantity' in updates && updates.quantity !== undefined) {
    row.quantity = updates.quantity ?? null;
  }
  if ('price' in updates && updates.price !== undefined) {
    row.price = updates.price ?? null;
  }
  if ('isChecked' in updates && updates.isChecked !== undefined) {
    row.is_checked = updates.isChecked ? 1 : 0;
  }
  if ('externalId' in updates && updates.externalId !== undefined) {
    row.external_id = updates.externalId ?? null;
  }
  if ('metadata' in updates && updates.metadata !== undefined) {
    row.metadata = updates.metadata ? JSON.stringify(updates.metadata) : null;
  }

  return row;
}
