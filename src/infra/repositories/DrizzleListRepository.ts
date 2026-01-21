import { and, asc, count, desc, eq, like } from 'drizzle-orm';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

import { toCreateListRow, toDomainList, toUpdateListRow } from '@data/mappers';
import type { GroupResult, PaginatedResult, PaginationParams, SortCriteria } from '@domain/common';
import type {
  CreateListInput,
  List,
  ListFilterCriteria,
  ListGroupCriteria,
  ListRepository,
  ListSortField,
  UpdateListInput,
} from '@domain/list';

import type { DrizzleDB } from '../drizzle';
import { lists } from '../drizzle';

export class DrizzleListRepository implements ListRepository {
  constructor(private db: DrizzleDB) {}

  async create(input: CreateListInput): Promise<List> {
    const id = uuid();
    const row = toCreateListRow(input, id);
    await this.db.insert(lists).values({
      id: row.id,
      name: row.name,
      description: row.description,
      listType: row.list_type,
      isPrefabricated: row.is_prefabricated === 1,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
    const created = await this.getById(id);
    if (!created) {
      throw new Error('Failed to create list');
    }
    return created;
  }

  async getById(id: string): Promise<List | null> {
    const result = await this.db.select().from(lists).where(eq(lists.id, id)).limit(1);
    if (result.length === 0) {
      return null;
    }
    const row = result[0];
    return toDomainList({
      id: row.id,
      name: row.name,
      description: row.description,
      list_type: row.listType,
      is_prefabricated: row.isPrefabricated ? 1 : 0,
      created_at: row.createdAt.getTime(),
      updated_at: row.updatedAt.getTime(),
    });
  }

  async getAll(
    sort?: SortCriteria<ListSortField>,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<List>> {
    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? 50;

    const orderByColumn = this.getSortColumn(sort?.field as ListSortField);
    const orderDirection = sort?.direction === 'desc' ? desc : asc;

    const [items, totalResult] = await Promise.all([
      this.db
        .select()
        .from(lists)
        .orderBy(orderDirection(orderByColumn))
        .limit(limit)
        .offset(offset),
      this.db.select({ count: count() }).from(lists),
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    return {
      items: items.map((row) =>
        toDomainList({
          id: row.id,
          name: row.name,
          description: row.description,
          list_type: row.listType,
          is_prefabricated: row.isPrefabricated ? 1 : 0,
          created_at: row.createdAt.getTime(),
          updated_at: row.updatedAt.getTime(),
        }),
      ),
      totalCount,
      pagination: {
        offset,
        limit,
        hasMore: offset + items.length < totalCount,
      },
    };
  }

  async update(id: string, updates: UpdateListInput): Promise<List | null> {
    const existing = await this.getById(id);
    if (!existing) {
      return null;
    }

    const row = toUpdateListRow(updates);
    await this.db
      .update(lists)
      .set({
        ...(row.name !== undefined && { name: row.name }),
        ...(row.description !== undefined && { description: row.description }),
        updatedAt: new Date(row.updated_at),
      })
      .where(eq(lists.id, id));

    return this.getById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(lists).where(eq(lists.id, id));
    return result.changes > 0;
  }

  async search(
    criteria: ListFilterCriteria,
    sort?: SortCriteria<ListSortField>,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<List>> {
    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? 50;

    const conditions = [];
    if (criteria.query) {
      conditions.push(like(lists.name, `%${criteria.query}%`));
    }
    if (criteria.listType) {
      conditions.push(eq(lists.listType, criteria.listType));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const orderByColumn = this.getSortColumn(sort?.field as ListSortField);
    const orderDirection = sort?.direction === 'desc' ? desc : asc;

    const [items, totalResult] = await Promise.all([
      this.db
        .select()
        .from(lists)
        .where(whereClause)
        .orderBy(orderDirection(orderByColumn))
        .limit(limit)
        .offset(offset),
      this.db.select({ count: count() }).from(lists).where(whereClause),
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    return {
      items: items.map((row) =>
        toDomainList({
          id: row.id,
          name: row.name,
          description: row.description,
          list_type: row.listType,
          is_prefabricated: row.isPrefabricated ? 1 : 0,
          created_at: row.createdAt.getTime(),
          updated_at: row.updatedAt.getTime(),
        }),
      ),
      totalCount,
      pagination: {
        offset,
        limit,
        hasMore: offset + items.length < totalCount,
      },
    };
  }

  async groupBy(criteria: ListGroupCriteria): Promise<GroupResult<List, ListGroupCriteria>> {
    const allLists = await this.db.select().from(lists);

    const grouped: GroupResult<List, ListGroupCriteria> = {};

    for (const row of allLists) {
      const list = toDomainList({
        id: row.id,
        name: row.name,
        description: row.description,
        list_type: row.listType,
        is_prefabricated: row.isPrefabricated ? 1 : 0,
        created_at: row.createdAt.getTime(),
        updated_at: row.updatedAt.getTime(),
      });

      const key = criteria === 'listType' ? list.listType : criteria;
      if (!grouped[key as ListGroupCriteria]) {
        grouped[key as ListGroupCriteria] = [];
      }
      grouped[key as ListGroupCriteria]!.push(list);
    }

    return grouped;
  }

  private getSortColumn(field?: ListSortField) {
    switch (field) {
      case 'name':
        return lists.name;
      case 'updatedAt':
        return lists.updatedAt;
      case 'sortOrder':
        return lists.createdAt;
      case 'createdAt':
      default:
        return lists.createdAt;
    }
  }
}
