import { asc, count, desc, eq } from 'drizzle-orm';

import type {
  BaseSortField,
  PaginatedResult,
  PaginationParams,
  SortCriteria,
} from '@domain/common';
import type { User, UserRepository } from '@domain/user';
import { toDomainUser } from '@data/mappers';

import type { DrizzleDB } from '../drizzle';
import { users } from '../drizzle';

export class DrizzleUserRepository implements UserRepository {
  constructor(private db: DrizzleDB) {}

  async getById(id: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    if (result.length === 0) {
      return null;
    }
    return this.mapRowToUser(result[0]);
  }

  async getAll(
    sort?: SortCriteria<BaseSortField>,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<User>> {
    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? 50;

    const orderByColumn = this.getSortColumn(sort?.field as BaseSortField);
    const orderDirection = sort?.direction === 'desc' ? desc : asc;

    const [rows, totalResult] = await Promise.all([
      this.db
        .select()
        .from(users)
        .orderBy(orderDirection(orderByColumn))
        .limit(limit)
        .offset(offset),
      this.db.select({ count: count() }).from(users),
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    return {
      items: rows.map((row) => this.mapRowToUser(row)),
      totalCount,
      pagination: {
        offset,
        limit,
        hasMore: offset + rows.length < totalCount,
      },
    };
  }

  private mapRowToUser(row: typeof users.$inferSelect): User {
    return toDomainUser({
      id: row.id,
      name: row.name,
      email: row.email,
      photo_url: row.photoUrl,
      created_at: row.createdAt.getTime(),
      updated_at: row.updatedAt.getTime(),
    });
  }

  private getSortColumn(field?: BaseSortField) {
    switch (field) {
      case 'updatedAt':
        return users.updatedAt;
      case 'createdAt':
      default:
        return users.createdAt;
    }
  }
}
