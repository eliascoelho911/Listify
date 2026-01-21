/**
 * Container Tests
 *
 * Tests for the DI container buildDependenciesSync function.
 * Note: These tests require mocking the database.
 */

import { buildDependenciesSync } from '@app/di/container';
import type { DrizzleDB } from '@infra/drizzle';

// Create a mock DrizzleDB instance
const createMockDb = (): DrizzleDB =>
  ({
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }) as unknown as DrizzleDB;

describe('buildDependenciesSync', () => {
  it('should build all required dependencies', () => {
    const mockDb = createMockDb();
    const dependencies = buildDependenciesSync(mockDb);

    expect(dependencies).toBeDefined();
    expect(dependencies.db).toBe(mockDb);
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

  it('should return smart input parser service', () => {
    const mockDb = createMockDb();
    const dependencies = buildDependenciesSync(mockDb);

    expect(dependencies.smartInputParser).toBeDefined();
    expect(typeof dependencies.smartInputParser.parse).toBe('function');
  });

  it('should return category inference service', () => {
    const mockDb = createMockDb();
    const dependencies = buildDependenciesSync(mockDb);

    expect(dependencies.categoryInference).toBeDefined();
    expect(typeof dependencies.categoryInference.infer).toBe('function');
  });
});
