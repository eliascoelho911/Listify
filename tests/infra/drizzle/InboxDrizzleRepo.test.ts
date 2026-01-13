/**
 * InboxDrizzleRepo Tests
 *
 * Unit tests for the Drizzle ORM implementation of InboxRepository.
 * Tests all CRUD operations with mocked database.
 */

import { InboxDrizzleRepo } from '@drizzle/InboxDrizzleRepo';

import type { DrizzleDB } from '@app/di/types';
import { UserInputNotFoundError } from '@domain/inbox/use-cases/errors';

type MockTransaction = {
  insert: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  query: {
    tags: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
    };
    userInputs: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
    };
    inputTags: {
      findMany: jest.Mock;
    };
  };
};

const createMockTransaction = (): MockTransaction => ({
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockResolvedValue(undefined),
  }),
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    }),
  }),
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockResolvedValue(undefined),
  }),
  query: {
    tags: {
      findFirst: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
    },
    userInputs: {
      findFirst: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
    },
    inputTags: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  },
});

const createMockDb = (mockTx?: MockTransaction): DrizzleDB => {
  const tx = mockTx ?? createMockTransaction();

  return {
    transaction: jest.fn().mockImplementation(async (fn) => fn(tx)),
    query: {
      tags: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue(null),
      },
      userInputs: {
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
      },
      inputTags: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    },
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockResolvedValue(undefined),
    }),
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue(undefined),
      }),
    }),
    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    }),
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockResolvedValue([{ count: 0 }]),
    }),
  } as unknown as DrizzleDB;
};

describe('InboxDrizzleRepo', () => {
  describe('createUserInput', () => {
    it('should create user input with extracted tags', async () => {
      const mockTx = createMockTransaction();
      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.createUserInput({ text: 'Buy milk #groceries' });

      expect(result).toBeDefined();
      expect(result.text).toBe('Buy milk #groceries');
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.tags).toHaveLength(1);
      expect(result.tags[0].name).toBe('groceries');
    });

    it('should increment usage_count for existing tags', async () => {
      const mockTx = createMockTransaction();
      mockTx.query.tags.findFirst = jest.fn().mockResolvedValue({
        id: 'existing-tag-id',
        name: 'groceries',
        usageCount: 5,
        createdAt: new Date().toISOString(),
      });

      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.createUserInput({ text: 'Buy bread #groceries' });

      expect(result.tags[0].usageCount).toBe(6);
      expect(mockTx.update).toHaveBeenCalled();
    });

    it('should create new tag if not exists', async () => {
      const mockTx = createMockTransaction();
      mockTx.query.tags.findFirst = jest.fn().mockResolvedValue(null);

      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.createUserInput({ text: 'New item #newtag' });

      expect(result.tags[0].name).toBe('newtag');
      expect(result.tags[0].usageCount).toBe(1);
    });

    it('should handle text without tags', async () => {
      const mockTx = createMockTransaction();
      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.createUserInput({ text: 'Buy milk' });

      expect(result.tags).toHaveLength(0);
    });

    it('should extract multiple tags', async () => {
      const mockTx = createMockTransaction();
      mockTx.query.tags.findFirst = jest.fn().mockResolvedValue(null);

      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.createUserInput({ text: 'Buy #milk and #bread' });

      expect(result.tags).toHaveLength(2);
      expect(result.tags.map((t) => t.name)).toContain('milk');
      expect(result.tags.map((t) => t.name)).toContain('bread');
    });

    it('should handle duplicate tags in text', async () => {
      const mockTx = createMockTransaction();
      mockTx.query.tags.findFirst = jest.fn().mockResolvedValue(null);

      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.createUserInput({ text: '#groceries buy milk #groceries' });

      expect(result.tags).toHaveLength(1);
      expect(result.tags[0].name).toBe('groceries');
    });
  });

  describe('updateUserInput', () => {
    it('should update text and recalculate tags', async () => {
      const mockTx = createMockTransaction();
      mockTx.query.userInputs.findFirst = jest.fn().mockResolvedValue({
        id: 'test-id',
        text: 'Old text #oldtag',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      mockTx.query.inputTags.findMany = jest.fn().mockResolvedValue([
        {
          inputId: 'test-id',
          tagId: 'old-tag-id',
          tag: {
            id: 'old-tag-id',
            name: 'oldtag',
            usageCount: 3,
            createdAt: new Date().toISOString(),
          },
        },
      ]);
      mockTx.query.tags.findFirst = jest.fn().mockResolvedValue(null);

      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.updateUserInput({ id: 'test-id', text: 'New text #newtag' });

      expect(result.text).toBe('New text #newtag');
      expect(result.tags).toHaveLength(1);
      expect(result.tags[0].name).toBe('newtag');
    });

    it('should update updatedAt timestamp', async () => {
      const oldDate = new Date('2024-01-01');
      const mockTx = createMockTransaction();
      mockTx.query.userInputs.findFirst = jest.fn().mockResolvedValue({
        id: 'test-id',
        text: 'Old text',
        createdAt: oldDate.toISOString(),
        updatedAt: oldDate.toISOString(),
      });

      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.updateUserInput({ id: 'test-id', text: 'New text' });

      expect(result.updatedAt.getTime()).toBeGreaterThan(oldDate.getTime());
      expect(result.createdAt.toISOString()).toBe(oldDate.toISOString());
    });

    it('should throw UserInputNotFoundError for invalid id', async () => {
      const mockTx = createMockTransaction();
      mockTx.query.userInputs.findFirst = jest.fn().mockResolvedValue(null);

      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      await expect(
        repo.updateUserInput({ id: 'non-existent-id', text: 'New text' }),
      ).rejects.toThrow(UserInputNotFoundError);
    });

    it('should decrement old tag usage and increment new tag usage', async () => {
      const mockTx = createMockTransaction();
      mockTx.query.userInputs.findFirst = jest.fn().mockResolvedValue({
        id: 'test-id',
        text: 'Old text #oldtag',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      mockTx.query.inputTags.findMany = jest.fn().mockResolvedValue([
        {
          inputId: 'test-id',
          tagId: 'old-tag-id',
          tag: {
            id: 'old-tag-id',
            name: 'oldtag',
            usageCount: 5,
            createdAt: new Date().toISOString(),
          },
        },
      ]);
      mockTx.query.tags.findFirst = jest.fn().mockResolvedValue({
        id: 'new-tag-id',
        name: 'newtag',
        usageCount: 2,
        createdAt: new Date().toISOString(),
      });

      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.updateUserInput({ id: 'test-id', text: 'New text #newtag' });

      expect(result.tags[0].usageCount).toBe(3);
      expect(mockTx.update).toHaveBeenCalled();
    });
  });

  describe('deleteUserInput', () => {
    it('should delete input and decrement tag usage', async () => {
      const mockTx = createMockTransaction();
      mockTx.query.userInputs.findFirst = jest.fn().mockResolvedValue({
        id: 'test-id',
        text: 'Text #groceries',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      mockTx.query.inputTags.findMany = jest.fn().mockResolvedValue([
        {
          inputId: 'test-id',
          tagId: 'tag-id',
          tag: {
            id: 'tag-id',
            name: 'groceries',
            usageCount: 3,
            createdAt: new Date().toISOString(),
          },
        },
      ]);

      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      await repo.deleteUserInput('test-id');

      expect(mockTx.update).toHaveBeenCalled();
      expect(mockTx.delete).toHaveBeenCalled();
    });

    it('should throw UserInputNotFoundError for invalid id', async () => {
      const mockTx = createMockTransaction();
      mockTx.query.userInputs.findFirst = jest.fn().mockResolvedValue(null);

      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      await expect(repo.deleteUserInput('non-existent-id')).rejects.toThrow(UserInputNotFoundError);
    });

    it('should delete input without tags', async () => {
      const mockTx = createMockTransaction();
      mockTx.query.userInputs.findFirst = jest.fn().mockResolvedValue({
        id: 'test-id',
        text: 'Text without tags',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      mockTx.query.inputTags.findMany = jest.fn().mockResolvedValue([]);

      const mockDb = createMockDb(mockTx);
      const repo = new InboxDrizzleRepo(mockDb);

      await expect(repo.deleteUserInput('test-id')).resolves.not.toThrow();
    });
  });

  describe('searchTags', () => {
    it('should return empty array for empty query', async () => {
      const mockDb = createMockDb();
      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.searchTags({ query: '' });

      expect(result).toEqual([]);
    });

    it('should return matching tags sorted by usage count', async () => {
      const mockDb = createMockDb();
      (mockDb.query.tags.findMany as jest.Mock).mockResolvedValue([
        { id: 'tag-1', name: 'groceries', usageCount: 5, createdAt: new Date().toISOString() },
        { id: 'tag-2', name: 'garden', usageCount: 10, createdAt: new Date().toISOString() },
        { id: 'tag-3', name: 'home', usageCount: 2, createdAt: new Date().toISOString() },
      ]);

      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.searchTags({ query: 'g' });

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('garden');
      expect(result[1].name).toBe('groceries');
    });

    it('should respect limit parameter', async () => {
      const mockDb = createMockDb();
      (mockDb.query.tags.findMany as jest.Mock).mockResolvedValue([
        { id: 'tag-1', name: 'a1', usageCount: 1, createdAt: new Date().toISOString() },
        { id: 'tag-2', name: 'a2', usageCount: 2, createdAt: new Date().toISOString() },
        { id: 'tag-3', name: 'a3', usageCount: 3, createdAt: new Date().toISOString() },
        { id: 'tag-4', name: 'a4', usageCount: 4, createdAt: new Date().toISOString() },
        { id: 'tag-5', name: 'a5', usageCount: 5, createdAt: new Date().toISOString() },
      ]);

      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.searchTags({ query: 'a', limit: 2 });

      expect(result).toHaveLength(2);
    });

    it('should be case-insensitive', async () => {
      const mockDb = createMockDb();
      (mockDb.query.tags.findMany as jest.Mock).mockResolvedValue([
        { id: 'tag-1', name: 'groceries', usageCount: 5, createdAt: new Date().toISOString() },
      ]);

      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.searchTags({ query: 'GROCER' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('groceries');
    });
  });

  describe('getUserInputById', () => {
    it('should return input when found', async () => {
      const mockDb = createMockDb();
      const now = new Date();
      (mockDb.query.userInputs.findFirst as jest.Mock).mockResolvedValue({
        id: 'test-id',
        text: 'Test input #tag',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        inputTags: [
          {
            tag: {
              id: 'tag-id',
              name: 'tag',
              usageCount: 1,
              createdAt: now.toISOString(),
            },
          },
        ],
      });

      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.getUserInputById('test-id');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('test-id');
      expect(result?.text).toBe('Test input #tag');
      expect(result?.tags).toHaveLength(1);
    });

    it('should return null when not found', async () => {
      const mockDb = createMockDb();
      (mockDb.query.userInputs.findFirst as jest.Mock).mockResolvedValue(null);

      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.getUserInputById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('getUserInputs', () => {
    it('should return paginated results', async () => {
      const mockDb = createMockDb();
      const now = new Date();
      (mockDb.query.userInputs.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'input-1',
          text: 'Input 1',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          inputTags: [],
        },
        {
          id: 'input-2',
          text: 'Input 2',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          inputTags: [],
        },
      ]);

      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.getUserInputs({ page: 0, limit: 10 });

      expect(result.items).toHaveLength(2);
      expect(result.offset).toBe(0);
      expect(result.limit).toBe(10);
      expect(result.hasMore).toBe(false);
    });

    it('should indicate hasMore when more items exist', async () => {
      const mockDb = createMockDb();
      const now = new Date();
      // Return limit + 1 items to indicate hasMore
      (mockDb.query.userInputs.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'input-1',
          text: 'Input 1',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          inputTags: [],
        },
        {
          id: 'input-2',
          text: 'Input 2',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          inputTags: [],
        },
        {
          id: 'input-3',
          text: 'Input 3',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          inputTags: [],
        },
      ]);

      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.getUserInputs({ page: 0, limit: 2 });

      expect(result.items).toHaveLength(2);
      expect(result.hasMore).toBe(true);
    });
  });

  describe('getAllTags', () => {
    it('should return all tags sorted by usage count', async () => {
      const mockDb = createMockDb();
      (mockDb.query.tags.findMany as jest.Mock).mockResolvedValue([
        { id: 'tag-1', name: 'groceries', usageCount: 10, createdAt: new Date().toISOString() },
        { id: 'tag-2', name: 'home', usageCount: 5, createdAt: new Date().toISOString() },
      ]);

      const repo = new InboxDrizzleRepo(mockDb);

      const result = await repo.getAllTags();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('groceries');
      expect(result[1].name).toBe('home');
    });
  });
});
