/**
 * Container Tests
 *
 * Tests for the DI container buildDependencies function.
 */

import { buildDependencies } from '@app/di/container';

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn().mockReturnValue({
    execSync: jest.fn(),
  }),
}));

// Mock drizzle-orm
jest.mock('drizzle-orm/expo-sqlite', () => ({
  drizzle: jest.fn().mockReturnValue({
    query: {
      userInputs: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
      tags: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
      inputTags: {
        findMany: jest.fn(),
      },
    },
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockResolvedValue([]),
    }),
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
    transaction: jest.fn(),
  }),
}));

// Mock the SQLite modules
jest.mock('@infra/storage/sqlite/SqliteDatabase', () => ({
  SqliteDatabase: jest.fn().mockImplementation(() => ({
    executeAsync: jest.fn(),
    runAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    getAllAsync: jest.fn(),
    withExclusiveTransactionAsync: jest.fn(),
    withTransactionAsync: jest.fn(),
  })),
}));

jest.mock('@infra/storage/sqlite/ShoppingSqliteRepo', () => ({
  ShoppingSqliteRepo: jest.fn().mockImplementation(() => ({
    getActiveList: jest.fn().mockResolvedValue({
      id: 'test-list',
      name: 'Test List',
      categories: [],
      preferences: { currencyCode: 'BRL' },
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  })),
}));

describe('buildDependencies', () => {
  it('should build all required dependencies', async () => {
    const dependencies = await buildDependencies();

    expect(dependencies).toBeDefined();
    expect(dependencies.database).toBeDefined();
    expect(dependencies.shoppingRepository).toBeDefined();
    expect(dependencies.inboxRepository).toBeDefined();
    expect(dependencies.inboxUseCases).toBeDefined();
    expect(dependencies.shoppingUseCases).toBeDefined();
  });

  it('should accept custom database name option', async () => {
    const { SqliteDatabase } = jest.requireMock('@infra/storage/sqlite/SqliteDatabase');

    await buildDependencies({ databaseName: 'custom-test.db' });

    expect(SqliteDatabase).toHaveBeenCalledWith({ databaseName: 'custom-test.db' });
  });

  it('should initialize shopping repository by calling getActiveList', async () => {
    const { ShoppingSqliteRepo } = jest.requireMock('@infra/storage/sqlite/ShoppingSqliteRepo');

    await buildDependencies();

    const mockInstance = ShoppingSqliteRepo.mock.results[0].value;
    expect(mockInstance.getActiveList).toHaveBeenCalled();
  });
});
