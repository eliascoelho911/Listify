/**
 * Container Tests
 *
 * Tests for the DI container buildDependencies function.
 * Note: These tests require mocking the database initialization
 * as SQLite cannot be opened in Jest environment.
 */

import { buildDependencies } from '@app/di/container';
import * as drizzle from '@infra/drizzle';

// Mock the drizzle initialization
jest.mock('@infra/drizzle', () => ({
  ...jest.requireActual('@infra/drizzle'),
  initializeDatabase: jest.fn(() => ({
    // Mock minimal DrizzleDB interface
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('buildDependencies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should build all required dependencies', async () => {
    const dependencies = await buildDependencies();

    expect(dependencies).toBeDefined();
    expect(dependencies.db).toBeDefined();
    expect(dependencies.listRepository).toBeDefined();
    expect(dependencies.sectionRepository).toBeDefined();
    expect(dependencies.noteItemRepository).toBeDefined();
    expect(dependencies.shoppingItemRepository).toBeDefined();
    expect(dependencies.movieItemRepository).toBeDefined();
    expect(dependencies.bookItemRepository).toBeDefined();
    expect(dependencies.gameItemRepository).toBeDefined();
    expect(dependencies.userRepository).toBeDefined();
    expect(dependencies.userPreferencesRepository).toBeDefined();
    expect(dependencies.purchaseHistoryRepository).toBeDefined();
    expect(dependencies.searchHistoryRepository).toBeDefined();
    expect(dependencies.globalSearchRepository).toBeDefined();
  });

  it('should initialize database with custom name when provided', async () => {
    const customDbName = 'test-listify.db';
    await buildDependencies({ databaseName: customDbName });

    expect(drizzle.initializeDatabase).toHaveBeenCalledWith(customDbName);
  });

  it('should initialize database with default name when not provided', async () => {
    await buildDependencies();

    expect(drizzle.initializeDatabase).toHaveBeenCalledWith(undefined);
  });
});
