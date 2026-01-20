import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

import type {
  CreateUserPreferencesInput,
  UpdateUserPreferencesInput,
  UserPreferences,
  UserPreferencesRepository,
} from '@domain/user';
import {
  toCreateUserPreferencesRow,
  toDomainUserPreferences,
  toUpdateUserPreferencesRow,
} from '@data/mappers';

import type { DrizzleDB } from '../drizzle';
import { userPreferences } from '../drizzle';

export class DrizzleUserPreferencesRepository implements UserPreferencesRepository {
  constructor(private db: DrizzleDB) {}

  async create(input: CreateUserPreferencesInput): Promise<UserPreferences> {
    const id = uuid();
    const row = toCreateUserPreferencesRow(input, id);
    await this.db.insert(userPreferences).values({
      id: row.id,
      userId: row.user_id,
      theme: row.theme,
      primaryColor: row.primary_color,
      layoutConfigs: row.layout_configs,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
    const created = await this.getByUserId(input.userId);
    if (!created) {
      throw new Error('Failed to create user preferences');
    }
    return created;
  }

  async update(id: string, updates: UpdateUserPreferencesInput): Promise<UserPreferences | null> {
    const existing = await this.getById(id);
    if (!existing) {
      return null;
    }

    const row = toUpdateUserPreferencesRow(updates);
    await this.db
      .update(userPreferences)
      .set({
        ...(row.theme !== undefined && { theme: row.theme }),
        ...(row.primary_color !== undefined && { primaryColor: row.primary_color }),
        ...(row.layout_configs !== undefined && { layoutConfigs: row.layout_configs }),
        updatedAt: new Date(row.updated_at),
      })
      .where(eq(userPreferences.id, id));

    return this.getById(id);
  }

  async getByUserId(userId: string): Promise<UserPreferences | null> {
    const result = await this.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    if (result.length === 0) {
      return null;
    }
    return this.mapRowToUserPreferences(result[0]);
  }

  private async getById(id: string): Promise<UserPreferences | null> {
    const result = await this.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.id, id))
      .limit(1);
    if (result.length === 0) {
      return null;
    }
    return this.mapRowToUserPreferences(result[0]);
  }

  private mapRowToUserPreferences(row: typeof userPreferences.$inferSelect): UserPreferences {
    return toDomainUserPreferences({
      id: row.id,
      user_id: row.userId,
      theme: row.theme,
      primary_color: row.primaryColor,
      layout_configs: row.layoutConfigs as string,
      created_at: row.createdAt.getTime(),
      updated_at: row.updatedAt.getTime(),
    });
  }
}
