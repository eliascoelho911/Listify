import { asc, count, desc, eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

import type {
  BaseSortField,
  PaginatedResult,
  PaginationParams,
  SortCriteria,
} from '@domain/common';
import type {
  CreatePurchaseHistoryInput,
  PurchaseHistory,
  PurchaseHistoryRepository,
} from '@domain/purchase-history';
import { toCreatePurchaseHistoryRow, toDomainPurchaseHistory } from '@data/mappers';

import type { DrizzleDB } from '../drizzle';
import { purchaseHistory } from '../drizzle';

export class DrizzlePurchaseHistoryRepository implements PurchaseHistoryRepository {
  constructor(private db: DrizzleDB) {}

  async create(input: CreatePurchaseHistoryInput): Promise<PurchaseHistory> {
    const id = uuid();
    const row = toCreatePurchaseHistoryRow(input, id);
    await this.db.insert(purchaseHistory).values({
      id: row.id,
      listId: row.list_id,
      purchaseDate: new Date(row.purchase_date),
      totalValue: row.total_value,
      sections: row.sections,
      items: row.items,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
    const created = await this.getById(id);
    if (!created) {
      throw new Error('Failed to create purchase history');
    }
    return created;
  }

  async getById(id: string): Promise<PurchaseHistory | null> {
    const result = await this.db
      .select()
      .from(purchaseHistory)
      .where(eq(purchaseHistory.id, id))
      .limit(1);
    if (result.length === 0) {
      return null;
    }
    return this.mapRowToPurchaseHistory(result[0]);
  }

  async getAll(
    sort?: SortCriteria<BaseSortField>,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<PurchaseHistory>> {
    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? 50;

    const orderByColumn = this.getSortColumn(sort?.field as BaseSortField);
    const orderDirection = sort?.direction === 'desc' ? desc : asc;

    const [rows, totalResult] = await Promise.all([
      this.db
        .select()
        .from(purchaseHistory)
        .orderBy(orderDirection(orderByColumn))
        .limit(limit)
        .offset(offset),
      this.db.select({ count: count() }).from(purchaseHistory),
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    return {
      items: rows.map((row) => this.mapRowToPurchaseHistory(row)),
      totalCount,
      pagination: {
        offset,
        limit,
        hasMore: offset + rows.length < totalCount,
      },
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(purchaseHistory).where(eq(purchaseHistory.id, id));
    return result.changes > 0;
  }

  async getByListId(listId: string): Promise<PurchaseHistory[]> {
    const rows = await this.db
      .select()
      .from(purchaseHistory)
      .where(eq(purchaseHistory.listId, listId))
      .orderBy(desc(purchaseHistory.purchaseDate));
    return rows.map((row) => this.mapRowToPurchaseHistory(row));
  }

  private mapRowToPurchaseHistory(row: typeof purchaseHistory.$inferSelect): PurchaseHistory {
    return toDomainPurchaseHistory({
      id: row.id,
      list_id: row.listId,
      purchase_date: row.purchaseDate.getTime(),
      total_value: row.totalValue,
      sections: row.sections as string,
      items: row.items as string,
      created_at: row.createdAt.getTime(),
      updated_at: row.updatedAt.getTime(),
    });
  }

  private getSortColumn(field?: BaseSortField) {
    switch (field) {
      case 'updatedAt':
        return purchaseHistory.updatedAt;
      case 'createdAt':
      default:
        return purchaseHistory.createdAt;
    }
  }
}
