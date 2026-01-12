/**
 * InboxSqliteRepo Tests
 *
 * Unit tests for the InboxSqliteRepo class with mocked database.
 */

import type { Tag } from '@domain/inbox/entities';
import { UserInputNotFoundError } from '@domain/inbox/use-cases/errors';
import { InboxSqliteRepo } from '@infra/storage/sqlite/InboxSqliteRepo';
import type { SqliteDatabase } from '@infra/storage/sqlite/SqliteDatabase';

const createMockDatabase = () => {
  const mockTransactionFn = jest.fn();

  return {
    run: jest.fn().mockResolvedValue(undefined),
    getAll: jest.fn().mockResolvedValue([]),
    getFirst: jest.fn().mockResolvedValue(null),
    transaction: jest.fn().mockImplementation(async (fn) => {
      const mockTxn = {
        runAsync: mockTransactionFn,
        getAllAsync: jest.fn().mockResolvedValue([]),
        getFirstAsync: jest.fn().mockResolvedValue(null),
      };
      return fn(mockTxn);
    }),
    _mockTransactionFn: mockTransactionFn,
  } as unknown as SqliteDatabase & { _mockTransactionFn: jest.Mock };
};

describe('InboxSqliteRepo', () => {
  let mockDb: ReturnType<typeof createMockDatabase>;
  let repo: InboxSqliteRepo;

  beforeEach(() => {
    mockDb = createMockDatabase();
    repo = new InboxSqliteRepo(mockDb);
    jest.clearAllMocks();
  });

  describe('createUserInput', () => {
    it('should create a user input and return it', async () => {
      const text = 'Buy milk #groceries';

      const result = await repo.createUserInput({ text });

      expect(result).toBeDefined();
      expect(result.text).toBe(text);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should extract tags from text', async () => {
      const text = 'Buy milk #groceries #urgent';

      const result = await repo.createUserInput({ text });

      expect(result.tags).toHaveLength(2);
      expect(result.tags.map((t: Tag) => t.name)).toContain('groceries');
      expect(result.tags.map((t: Tag) => t.name)).toContain('urgent');
    });

    it('should create input with no tags when none present', async () => {
      const text = 'Buy milk';

      const result = await repo.createUserInput({ text });

      expect(result.tags).toHaveLength(0);
    });
  });

  describe('getUserInputById', () => {
    it('should return null when input not found', async () => {
      mockDb.getFirst = jest.fn().mockResolvedValue(null);
      repo = new InboxSqliteRepo(mockDb);

      const result = await repo.getUserInputById('non-existent-id');

      expect(result).toBeNull();
    });

    it('should return user input when found', async () => {
      const mockRow = {
        id: 'test-id',
        text: 'Test text',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockDb.getFirst = jest.fn().mockResolvedValue(mockRow);
      mockDb.getAll = jest.fn().mockResolvedValue([]);
      repo = new InboxSqliteRepo(mockDb);

      const result = await repo.getUserInputById('test-id');

      expect(result).toBeDefined();
      expect(result?.id).toBe('test-id');
      expect(result?.text).toBe('Test text');
    });
  });

  describe('getUserInputs', () => {
    it('should return empty array when no inputs exist', async () => {
      mockDb.getAll = jest.fn().mockResolvedValue([]);
      mockDb.getFirst = jest.fn().mockResolvedValue({ count: 0 });
      repo = new InboxSqliteRepo(mockDb);

      const result = await repo.getUserInputs({ page: 0 });

      expect(result.items).toEqual([]);
      expect(result.hasMore).toBe(false);
      expect(result.total).toBe(0);
    });

    it('should return paginated inputs', async () => {
      const mockRows = [
        {
          id: 'id-1',
          text: 'Text 1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'id-2',
          text: 'Text 2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      mockDb.getAll = jest.fn().mockResolvedValueOnce(mockRows).mockResolvedValue([]);
      mockDb.getFirst = jest.fn().mockResolvedValue({ count: 2 });
      repo = new InboxSqliteRepo(mockDb);

      const result = await repo.getUserInputs({ page: 0, limit: 20 });

      expect(result.items).toHaveLength(2);
      expect(result.hasMore).toBe(false);
      expect(result.total).toBe(2);
    });

    it('should detect hasMore when more items exist', async () => {
      const mockRows = Array.from({ length: 21 }, (_, i) => ({
        id: `id-${i}`,
        text: `Text ${i}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      mockDb.getAll = jest.fn().mockResolvedValueOnce(mockRows).mockResolvedValue([]);
      mockDb.getFirst = jest.fn().mockResolvedValue({ count: 50 });
      repo = new InboxSqliteRepo(mockDb);

      const result = await repo.getUserInputs({ page: 0, limit: 20 });

      expect(result.items).toHaveLength(20);
      expect(result.hasMore).toBe(true);
    });
  });

  describe('deleteUserInput', () => {
    it('should throw error when input not found', async () => {
      await expect(repo.deleteUserInput('non-existent-id')).rejects.toThrow(UserInputNotFoundError);
    });
  });

  describe('searchTags', () => {
    it('should return empty array when no tags match', async () => {
      mockDb.getAll = jest.fn().mockResolvedValue([]);
      repo = new InboxSqliteRepo(mockDb);

      const result = await repo.searchTags({ query: 'xyz' });

      expect(result).toEqual([]);
    });

    it('should return matching tags', async () => {
      const mockTags = [
        { id: 'tag-1', name: 'groceries', usage_count: 5, created_at: new Date().toISOString() },
        { id: 'tag-2', name: 'garden', usage_count: 2, created_at: new Date().toISOString() },
      ];

      mockDb.getAll = jest.fn().mockResolvedValue(mockTags);
      repo = new InboxSqliteRepo(mockDb);

      const result = await repo.searchTags({ query: 'g' });

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('groceries');
    });
  });

  describe('getAllTags', () => {
    it('should return all tags ordered by usage count', async () => {
      const mockTags = [
        { id: 'tag-1', name: 'groceries', usage_count: 10, created_at: new Date().toISOString() },
        { id: 'tag-2', name: 'urgent', usage_count: 5, created_at: new Date().toISOString() },
      ];

      mockDb.getAll = jest.fn().mockResolvedValue(mockTags);
      repo = new InboxSqliteRepo(mockDb);

      const result = await repo.getAllTags();

      expect(result).toHaveLength(2);
      expect(result[0].usageCount).toBe(10);
      expect(result[1].usageCount).toBe(5);
    });
  });

  describe('transaction', () => {
    it('should execute function within a transaction', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');

      const result = await repo.transaction(mockFn);

      expect(mockDb.transaction).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe('result');
    });
  });
});
