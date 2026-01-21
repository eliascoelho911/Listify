import type {
  CreateUserPreferencesInput,
  LayoutConfigs,
  Theme,
  UpdateUserPreferencesInput,
  UserPreferences,
} from '@domain/user';

import type {
  CreateUserPreferencesRow,
  UpdateUserPreferencesRow,
  UserPreferencesRow,
} from '../persistence';

/**
 * Convert SQLite row to domain UserPreferences entity
 */
export function toDomainUserPreferences(row: UserPreferencesRow): UserPreferences {
  return {
    id: row.id,
    userId: row.user_id,
    theme: row.theme as Theme,
    primaryColor: row.primary_color ?? undefined,
    layoutConfigs: JSON.parse(row.layout_configs) as LayoutConfigs,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Convert domain CreateUserPreferencesInput to SQLite row for insertion
 */
export function toCreateUserPreferencesRow(
  input: CreateUserPreferencesInput,
  id: string,
): CreateUserPreferencesRow {
  const now = Date.now();
  return {
    id,
    user_id: input.userId,
    theme: input.theme,
    primary_color: input.primaryColor ?? null,
    layout_configs: JSON.stringify(input.layoutConfigs),
    created_at: now,
    updated_at: now,
  };
}

/**
 * Convert domain UpdateUserPreferencesInput to partial SQLite row for update
 */
export function toUpdateUserPreferencesRow(
  updates: UpdateUserPreferencesInput,
): UpdateUserPreferencesRow {
  return {
    ...(updates.theme !== undefined && { theme: updates.theme }),
    ...(updates.primaryColor !== undefined && { primary_color: updates.primaryColor ?? null }),
    ...(updates.layoutConfigs !== undefined && {
      layout_configs: JSON.stringify(updates.layoutConfigs),
    }),
    updated_at: Date.now(),
  };
}
