/**
 * Container Tests
 *
 * Tests for the DI container buildDependencies function.
 */

import { buildDependencies } from '@app/di/container';

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

jest.mock('@infra/storage/sqlite/InboxSqliteRepo', () => ({
  InboxSqliteRepo: jest.fn().mockImplementation(() => ({
    createUserInput: jest.fn(),
    updateUserInput: jest.fn(),
    deleteUserInput: jest.fn(),
    getUserInputById: jest.fn(),
    getUserInputs: jest.fn(),
    searchTags: jest.fn(),
    getAllTags: jest.fn(),
    transaction: jest.fn(),
  })),
}));

describe('buildDependencies', () => {
  it('should build all required dependencies', async () => {
    const dependencies = await buildDependencies();

    expect(dependencies).toBeDefined();
    expect(dependencies.database).toBeDefined();
    expect(dependencies.shoppingRepository).toBeDefined();
    expect(dependencies.inboxRepository).toBeDefined();
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
