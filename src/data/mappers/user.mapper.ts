import type { CreateUserInput, UpdateUserInput, User } from '@domain/user';
import type { CreateUserRow, UpdateUserRow, UserRow } from '../persistence';

/**
 * Convert SQLite row to domain User entity
 */
export function toDomainUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    photoUrl: row.photo_url ?? undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Convert domain CreateUserInput to SQLite row for insertion
 */
export function toCreateUserRow(input: CreateUserInput, id: string): CreateUserRow {
  const now = Date.now();
  return {
    id,
    name: input.name,
    email: input.email,
    photo_url: input.photoUrl ?? null,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Convert domain UpdateUserInput to partial SQLite row for update
 */
export function toUpdateUserRow(updates: UpdateUserInput): UpdateUserRow {
  return {
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.email !== undefined && { email: updates.email }),
    ...(updates.photoUrl !== undefined && { photo_url: updates.photoUrl ?? null }),
    updated_at: Date.now(),
  };
}
