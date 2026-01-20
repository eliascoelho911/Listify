import type { CreateUserInput, UpdateUserInput, User } from '@domain/user';

describe('User Entity', () => {
  describe('User type structure', () => {
    it('should have correct shape', () => {
      const user: User = {
        id: 'uuid-1',
        name: 'John Doe',
        email: 'john@example.com',
        photoUrl: 'https://example.com/photo.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(user.id).toBe('uuid-1');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.photoUrl).toBe('https://example.com/photo.jpg');
    });

    it('should allow optional photoUrl', () => {
      const userWithPhoto: User = {
        id: '1',
        name: 'With Photo',
        email: 'user@example.com',
        photoUrl: 'https://example.com/photo.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(userWithPhoto.photoUrl).toBeDefined();

      const userWithoutPhoto: User = {
        id: '2',
        name: 'Without Photo',
        email: 'user2@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(userWithoutPhoto.photoUrl).toBeUndefined();
    });
  });

  describe('CreateUserInput type', () => {
    it('should exclude id, createdAt, and updatedAt', () => {
      const input: CreateUserInput = {
        name: 'New User',
        email: 'newuser@example.com',
      };

      expect(input.name).toBe('New User');
      expect(input.email).toBe('newuser@example.com');
    });

    it('should allow optional photoUrl', () => {
      const inputWithPhoto: CreateUserInput = {
        name: 'User',
        email: 'user@example.com',
        photoUrl: 'https://example.com/photo.jpg',
      };

      expect(inputWithPhoto.photoUrl).toBeDefined();

      const inputWithoutPhoto: CreateUserInput = {
        name: 'User',
        email: 'user@example.com',
      };

      expect(inputWithoutPhoto.photoUrl).toBeUndefined();
    });
  });

  describe('UpdateUserInput type', () => {
    it('should make all fields optional', () => {
      const fullUpdate: UpdateUserInput = {
        name: 'Updated Name',
        email: 'updated@example.com',
        photoUrl: 'https://example.com/new-photo.jpg',
        updatedAt: new Date(),
      };

      expect(fullUpdate.name).toBe('Updated Name');
      expect(fullUpdate.email).toBe('updated@example.com');

      const partialUpdate: UpdateUserInput = {
        name: 'Only Name',
      };

      expect(partialUpdate.name).toBe('Only Name');
      expect(partialUpdate.email).toBeUndefined();
    });
  });

  describe('Entity traits composition', () => {
    it('should have Entity trait (id)', () => {
      const user: User = {
        id: 'entity-id',
        name: 'Test',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(typeof user.id).toBe('string');
    });

    it('should have Timestamped trait (createdAt, updatedAt)', () => {
      const now = new Date();
      const user: User = {
        id: '1',
        name: 'Test',
        email: 'test@example.com',
        createdAt: now,
        updatedAt: now,
      };

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });
});
