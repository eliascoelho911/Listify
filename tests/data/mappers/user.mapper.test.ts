import type { CreateUserInput, User } from '@domain/user';
import type { CreateUserRow, UserRow, UpdateUserRow } from '@data/persistence';

import { toCreateUserRow, toDomainUser, toUpdateUserRow } from '@data/mappers/user.mapper';

describe('User Mapper', () => {
  describe('toDomainUser', () => {
    it('should convert SQLite row to domain entity', () => {
      const row: UserRow = {
        id: 'uuid-123',
        name: 'John Doe',
        email: 'john@example.com',
        photo_url: 'https://example.com/photo.jpg',
        created_at: 1704067200000,
        updated_at: 1704153600000,
      };

      const user = toDomainUser(row);

      expect(user.id).toBe('uuid-123');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.photoUrl).toBe('https://example.com/photo.jpg');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should convert null photo_url to undefined', () => {
      const row: UserRow = {
        id: 'uuid-1',
        name: 'Test User',
        email: 'test@example.com',
        photo_url: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const user = toDomainUser(row);

      expect(user.photoUrl).toBeUndefined();
    });
  });

  describe('toCreateUserRow', () => {
    it('should convert domain input to SQLite row', () => {
      const input: CreateUserInput = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        photoUrl: 'https://example.com/jane.jpg',
      };
      const id = 'generated-uuid';

      const row = toCreateUserRow(input, id);

      expect(row.id).toBe('generated-uuid');
      expect(row.name).toBe('Jane Doe');
      expect(row.email).toBe('jane@example.com');
      expect(row.photo_url).toBe('https://example.com/jane.jpg');
      expect(typeof row.created_at).toBe('number');
      expect(typeof row.updated_at).toBe('number');
    });

    it('should convert undefined photoUrl to null', () => {
      const input: CreateUserInput = {
        name: 'Test',
        email: 'test@example.com',
      };

      const row = toCreateUserRow(input, 'uuid');

      expect(row.photo_url).toBeNull();
    });

    it('should set timestamps to current time', () => {
      const before = Date.now();
      const input: CreateUserInput = {
        name: 'Test',
        email: 'test@example.com',
      };

      const row = toCreateUserRow(input, 'uuid');
      const after = Date.now();

      expect(row.created_at).toBeGreaterThanOrEqual(before);
      expect(row.created_at).toBeLessThanOrEqual(after);
      expect(row.updated_at).toBe(row.created_at);
    });
  });

  describe('toUpdateUserRow', () => {
    it('should convert partial update input to row', () => {
      const updates = {
        name: 'Updated Name',
        email: 'new@example.com',
      };

      const row = toUpdateUserRow(updates);

      expect(row.name).toBe('Updated Name');
      expect(row.email).toBe('new@example.com');
      expect(typeof row.updated_at).toBe('number');
    });

    it('should handle partial updates', () => {
      const updates = { name: 'Only Name' };

      const row = toUpdateUserRow(updates);

      expect(row.name).toBe('Only Name');
      expect(row.email).toBeUndefined();
      expect(row.photo_url).toBeUndefined();
    });

    it('should always set updated_at timestamp', () => {
      const before = Date.now();
      const row = toUpdateUserRow({});
      const after = Date.now();

      expect(row.updated_at).toBeGreaterThanOrEqual(before);
      expect(row.updated_at).toBeLessThanOrEqual(after);
    });
  });

  describe('roundtrip conversion', () => {
    it('should maintain data integrity through create and read', () => {
      const input: CreateUserInput = {
        name: 'Roundtrip User',
        email: 'roundtrip@example.com',
        photoUrl: 'https://example.com/roundtrip.jpg',
      };
      const id = 'roundtrip-uuid';

      const createRow = toCreateUserRow(input, id);

      const readRow: UserRow = {
        id: createRow.id,
        name: createRow.name,
        email: createRow.email,
        photo_url: createRow.photo_url,
        created_at: createRow.created_at,
        updated_at: createRow.updated_at,
      };

      const user = toDomainUser(readRow);

      expect(user.id).toBe(id);
      expect(user.name).toBe(input.name);
      expect(user.email).toBe(input.email);
      expect(user.photoUrl).toBe(input.photoUrl);
    });
  });
});
