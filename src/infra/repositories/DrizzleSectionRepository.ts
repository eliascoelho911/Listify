import { asc, count, desc, eq } from 'drizzle-orm';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

import { toCreateSectionRow, toDomainSection, toUpdateSectionRow } from '@data/mappers';
import type {
  PaginatedResult,
  PaginationParams,
  SortCriteria,
  SortOrderUpdate,
} from '@domain/common';
import type {
  CreateSectionInput,
  Section,
  SectionRepository,
  SectionSortField,
  UpdateSectionInput,
} from '@domain/section';

import type { DrizzleDB } from '../drizzle';
import { sections } from '../drizzle';

export class DrizzleSectionRepository implements SectionRepository {
  constructor(private db: DrizzleDB) {}

  async create(input: CreateSectionInput): Promise<Section> {
    const id = uuid();
    const row = toCreateSectionRow(input, id);
    await this.db.insert(sections).values({
      id: row.id,
      listId: row.list_id,
      name: row.name,
      sortOrder: row.sort_order,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
    const created = await this.getById(id);
    if (!created) {
      throw new Error('Failed to create section');
    }
    return created;
  }

  async getById(id: string): Promise<Section | null> {
    const result = await this.db.select().from(sections).where(eq(sections.id, id)).limit(1);
    if (result.length === 0) {
      return null;
    }
    return this.mapRowToSection(result[0]);
  }

  async getAll(
    sort?: SortCriteria<SectionSortField>,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<Section>> {
    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? 50;

    const orderByColumn = this.getSortColumn(sort?.field as SectionSortField);
    const orderDirection = sort?.direction === 'desc' ? desc : asc;

    const [rows, totalResult] = await Promise.all([
      this.db
        .select()
        .from(sections)
        .orderBy(orderDirection(orderByColumn))
        .limit(limit)
        .offset(offset),
      this.db.select({ count: count() }).from(sections),
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    return {
      items: rows.map((row) => this.mapRowToSection(row)),
      totalCount,
      pagination: {
        offset,
        limit,
        hasMore: offset + rows.length < totalCount,
      },
    };
  }

  async update(id: string, updates: UpdateSectionInput): Promise<Section | null> {
    const existing = await this.getById(id);
    if (!existing) {
      return null;
    }

    const row = toUpdateSectionRow(updates);
    await this.db
      .update(sections)
      .set({
        ...(row.name !== undefined && { name: row.name }),
        ...(row.sort_order !== undefined && { sortOrder: row.sort_order }),
        updatedAt: new Date(row.updated_at),
      })
      .where(eq(sections.id, id));

    return this.getById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(sections).where(eq(sections.id, id));
    return result.changes > 0;
  }

  async getByListId(listId: string): Promise<Section[]> {
    const rows = await this.db
      .select()
      .from(sections)
      .where(eq(sections.listId, listId))
      .orderBy(asc(sections.sortOrder));
    return rows.map((row) => this.mapRowToSection(row));
  }

  async updateSortOrder(updates: SortOrderUpdate[]): Promise<void> {
    for (const update of updates) {
      await this.db
        .update(sections)
        .set({
          sortOrder: update.sortOrder,
          updatedAt: new Date(),
        })
        .where(eq(sections.id, update.id));
    }
  }

  private mapRowToSection(row: typeof sections.$inferSelect): Section {
    return toDomainSection({
      id: row.id,
      list_id: row.listId,
      name: row.name,
      sort_order: row.sortOrder,
      created_at: row.createdAt.getTime(),
      updated_at: row.updatedAt.getTime(),
    });
  }

  private getSortColumn(field?: SectionSortField) {
    switch (field) {
      case 'name':
        return sections.name;
      case 'updatedAt':
        return sections.updatedAt;
      case 'sortOrder':
        return sections.sortOrder;
      case 'createdAt':
      default:
        return sections.createdAt;
    }
  }
}
