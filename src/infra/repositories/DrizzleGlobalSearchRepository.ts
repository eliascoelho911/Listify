import { and, asc, desc, gte, like, lte, or } from 'drizzle-orm';

import type {
  BaseSortField,
  PaginatedResult,
  PaginationParams,
  SortCriteria,
} from '@domain/common';
import type { Item } from '@domain/item';
import type { List } from '@domain/list';
import type {
  GlobalSearchCriteria,
  GlobalSearchRepository,
  GlobalSearchResultItem,
} from '@domain/search';
import { toDomainItem, toDomainList } from '@data/mappers';

import type { DrizzleDB } from '../drizzle';
import { items, lists } from '../drizzle';

export class DrizzleGlobalSearchRepository implements GlobalSearchRepository<Item, List> {
  constructor(private db: DrizzleDB) {}

  async search(
    criteria: GlobalSearchCriteria,
    sort?: SortCriteria<BaseSortField>,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<GlobalSearchResultItem<Item, List>>> {
    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? 50;
    const orderDirection = sort?.direction === 'desc' ? desc : asc;

    const results: GlobalSearchResultItem<Item, List>[] = [];

    // Search items if target is 'items' or 'all'
    if (criteria.target === 'items' || criteria.target === 'all') {
      const itemConditions = [];
      if (criteria.query) {
        itemConditions.push(like(items.title, `%${criteria.query}%`));
      }
      if (criteria.listId) {
        itemConditions.push(like(items.listId, criteria.listId));
      }
      if (criteria.dateRange) {
        itemConditions.push(gte(items.createdAt, criteria.dateRange.from));
        itemConditions.push(lte(items.createdAt, criteria.dateRange.to));
      }

      const itemWhereClause = itemConditions.length > 0 ? and(...itemConditions) : undefined;

      const itemRows = await this.db
        .select()
        .from(items)
        .where(itemWhereClause)
        .orderBy(orderDirection(items.createdAt));

      for (const row of itemRows) {
        const item = toDomainItem({
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
        results.push({ entityType: 'item', entity: item });
      }
    }

    // Search lists if target is 'lists' or 'all'
    if (criteria.target === 'lists' || criteria.target === 'all') {
      const listConditions = [];
      if (criteria.query) {
        listConditions.push(
          or(
            like(lists.name, `%${criteria.query}%`),
            like(lists.description, `%${criteria.query}%`),
          ),
        );
      }
      if (criteria.dateRange) {
        listConditions.push(gte(lists.createdAt, criteria.dateRange.from));
        listConditions.push(lte(lists.createdAt, criteria.dateRange.to));
      }

      const listWhereClause = listConditions.length > 0 ? and(...listConditions) : undefined;

      const listRows = await this.db
        .select()
        .from(lists)
        .where(listWhereClause)
        .orderBy(orderDirection(lists.createdAt));

      for (const row of listRows) {
        const list = toDomainList({
          id: row.id,
          name: row.name,
          description: row.description,
          list_type: row.listType,
          is_prefabricated: row.isPrefabricated ? 1 : 0,
          created_at: row.createdAt.getTime(),
          updated_at: row.updatedAt.getTime(),
        });
        results.push({ entityType: 'list', entity: list });
      }
    }

    // Sort combined results by createdAt
    results.sort((a, b) => {
      const aDate = a.entity.createdAt.getTime();
      const bDate = b.entity.createdAt.getTime();
      return sort?.direction === 'desc' ? bDate - aDate : aDate - bDate;
    });

    const totalCount = results.length;
    const paginatedResults = results.slice(offset, offset + limit);

    return {
      items: paginatedResults,
      totalCount,
      pagination: {
        offset,
        limit,
        hasMore: offset + paginatedResults.length < totalCount,
      },
    };
  }
}
