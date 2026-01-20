import { and, asc, count, desc, eq, gte, like, lte } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

import type { GroupResult, PaginatedResult, PaginationParams, SortCriteria } from '@domain/common';
import type {
  CreateNoteItemInput,
  ItemGroupCriteria,
  ItemSortField,
  NoteItem,
  NoteItemFilterCriteria,
  NoteItemRepository,
  UpdateNoteItemInput,
} from '@domain/item';
import { toCreateItemRow, toDomainNoteItem, toUpdateItemRow } from '@data/mappers';

import type { DrizzleDB } from '../drizzle';
import { items } from '../drizzle';

export class DrizzleNoteItemRepository implements NoteItemRepository {
  constructor(private db: DrizzleDB) {}

  async create(input: CreateNoteItemInput): Promise<NoteItem> {
    const id = uuid();
    const row = toCreateItemRow(input, id);
    await this.db.insert(items).values({
      id: row.id,
      listId: row.list_id,
      sectionId: row.section_id,
      title: row.title,
      type: row.type,
      sortOrder: row.sort_order,
      description: row.description,
      quantity: row.quantity,
      price: row.price,
      isChecked: row.is_checked === 1 ? true : row.is_checked === 0 ? false : undefined,
      externalId: row.external_id,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
    const created = await this.getById(id);
    if (!created) {
      throw new Error('Failed to create note item');
    }
    return created;
  }

  async getById(id: string): Promise<NoteItem | null> {
    const result = await this.db
      .select()
      .from(items)
      .where(and(eq(items.id, id), eq(items.type, 'note')))
      .limit(1);
    if (result.length === 0) {
      return null;
    }
    return this.mapRowToNoteItem(result[0]);
  }

  async getAll(
    sort?: SortCriteria<ItemSortField>,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<NoteItem>> {
    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? 50;

    const orderByColumn = this.getSortColumn(sort?.field as ItemSortField);
    const orderDirection = sort?.direction === 'desc' ? desc : asc;

    const [rows, totalResult] = await Promise.all([
      this.db
        .select()
        .from(items)
        .where(eq(items.type, 'note'))
        .orderBy(orderDirection(orderByColumn))
        .limit(limit)
        .offset(offset),
      this.db.select({ count: count() }).from(items).where(eq(items.type, 'note')),
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    return {
      items: rows.map((row) => this.mapRowToNoteItem(row)),
      totalCount,
      pagination: {
        offset,
        limit,
        hasMore: offset + rows.length < totalCount,
      },
    };
  }

  async update(id: string, updates: UpdateNoteItemInput): Promise<NoteItem | null> {
    const existing = await this.getById(id);
    if (!existing) {
      return null;
    }

    const row = toUpdateItemRow(updates);
    await this.db
      .update(items)
      .set({
        ...(row.title !== undefined && { title: row.title }),
        ...(row.list_id !== undefined && { listId: row.list_id }),
        ...(row.section_id !== undefined && { sectionId: row.section_id }),
        ...(row.sort_order !== undefined && { sortOrder: row.sort_order }),
        ...(row.description !== undefined && { description: row.description }),
        updatedAt: new Date(row.updated_at),
      })
      .where(eq(items.id, id));

    return this.getById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(items).where(and(eq(items.id, id), eq(items.type, 'note')));
    return result.changes > 0;
  }

  async getByListId(listId: string): Promise<NoteItem[]> {
    const rows = await this.db
      .select()
      .from(items)
      .where(and(eq(items.listId, listId), eq(items.type, 'note')))
      .orderBy(asc(items.sortOrder));
    return rows.map((row) => this.mapRowToNoteItem(row));
  }

  async getBySectionId(sectionId: string): Promise<NoteItem[]> {
    const rows = await this.db
      .select()
      .from(items)
      .where(and(eq(items.sectionId, sectionId), eq(items.type, 'note')))
      .orderBy(asc(items.sortOrder));
    return rows.map((row) => this.mapRowToNoteItem(row));
  }

  async search(
    criteria: NoteItemFilterCriteria,
    sort?: SortCriteria<ItemSortField>,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<NoteItem>> {
    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? 50;

    const conditions = [eq(items.type, 'note')];
    if (criteria.query) {
      conditions.push(like(items.title, `%${criteria.query}%`));
    }
    if (criteria.listId) {
      conditions.push(eq(items.listId, criteria.listId));
    }
    if (criteria.sectionId) {
      conditions.push(eq(items.sectionId, criteria.sectionId));
    }
    if (criteria.createdDateRange) {
      conditions.push(gte(items.createdAt, criteria.createdDateRange.from));
      conditions.push(lte(items.createdAt, criteria.createdDateRange.to));
    }
    if (criteria.updatedDateRange) {
      conditions.push(gte(items.updatedAt, criteria.updatedDateRange.from));
      conditions.push(lte(items.updatedAt, criteria.updatedDateRange.to));
    }

    const whereClause = and(...conditions);

    const orderByColumn = this.getSortColumn(sort?.field as ItemSortField);
    const orderDirection = sort?.direction === 'desc' ? desc : asc;

    const [rows, totalResult] = await Promise.all([
      this.db
        .select()
        .from(items)
        .where(whereClause)
        .orderBy(orderDirection(orderByColumn))
        .limit(limit)
        .offset(offset),
      this.db.select({ count: count() }).from(items).where(whereClause),
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    return {
      items: rows.map((row) => this.mapRowToNoteItem(row)),
      totalCount,
      pagination: {
        offset,
        limit,
        hasMore: offset + rows.length < totalCount,
      },
    };
  }

  async groupBy(criteria: ItemGroupCriteria): Promise<GroupResult<NoteItem, ItemGroupCriteria>> {
    const allItems = await this.db.select().from(items).where(eq(items.type, 'note'));

    const grouped: GroupResult<NoteItem, ItemGroupCriteria> = {};

    for (const row of allItems) {
      const item = this.mapRowToNoteItem(row);
      let key: string;

      switch (criteria) {
        case 'listId':
          key = item.listId ?? 'no-list';
          break;
        case 'sectionId':
          key = item.sectionId ?? 'no-section';
          break;
        case 'createdAt':
          key = item.createdAt.toISOString().split('T')[0];
          break;
        case 'updatedAt':
          key = item.updatedAt.toISOString().split('T')[0];
          break;
        default:
          key = criteria;
      }

      if (!grouped[key as ItemGroupCriteria]) {
        grouped[key as ItemGroupCriteria] = [];
      }
      grouped[key as ItemGroupCriteria]!.push(item);
    }

    return grouped;
  }

  private mapRowToNoteItem(row: typeof items.$inferSelect): NoteItem {
    return toDomainNoteItem({
      id: row.id,
      list_id: row.listId,
      section_id: row.sectionId,
      title: row.title,
      type: row.type,
      sort_order: row.sortOrder,
      description: row.description,
      quantity: row.quantity,
      price: row.price,
      is_checked: row.isChecked === true ? 1 : row.isChecked === false ? 0 : null,
      external_id: row.externalId,
      metadata: row.metadata ? JSON.stringify(row.metadata) : null,
      created_at: row.createdAt.getTime(),
      updated_at: row.updatedAt.getTime(),
    });
  }

  private getSortColumn(field?: ItemSortField) {
    switch (field) {
      case 'title':
        return items.title;
      case 'updatedAt':
        return items.updatedAt;
      case 'sortOrder':
        return items.sortOrder;
      case 'createdAt':
      default:
        return items.createdAt;
    }
  }
}
