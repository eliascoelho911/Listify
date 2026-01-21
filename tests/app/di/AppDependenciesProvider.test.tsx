/**
 * AppDependenciesProvider Tests
 *
 * Tests for the DI provider and hooks.
 */

import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';

import { AppDependenciesProvider, useAppDependencies } from '@app/di/AppDependenciesProvider';
import type { DrizzleDB } from '@infra/drizzle';

// Mock the DatabaseProvider's useDatabase hook
const mockDb = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as unknown as DrizzleDB;

jest.mock('@app/di/DatabaseProvider', () => ({
  useDatabase: jest.fn(() => mockDb),
}));

// Mock buildDependenciesSync
const mockDependencies = {
  db: mockDb,
  listRepository: {},
  sectionRepository: {},
  noteItemRepository: {},
  shoppingItemRepository: {},
  movieItemRepository: {},
  bookItemRepository: {},
  gameItemRepository: {},
  userRepository: {},
  userPreferencesRepository: {},
  purchaseHistoryRepository: {},
  searchHistoryRepository: {},
  globalSearchRepository: {},
  smartInputParser: { parse: jest.fn() },
  categoryInference: { infer: jest.fn() },
};

jest.mock('@app/di/container', () => ({
  buildDependenciesSync: jest.fn(() => mockDependencies),
}));

describe('AppDependenciesProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children with dependencies', () => {
    const { getByTestId } = render(
      <AppDependenciesProvider>
        <View testID="content" />
      </AppDependenciesProvider>,
    );

    expect(getByTestId('content')).toBeTruthy();
  });

  it('should provide dependencies to children', () => {
    let result: ReturnType<typeof useAppDependencies> | undefined;

    function TestComponent() {
      result = useAppDependencies();
      return <View testID="test" />;
    }

    render(
      <AppDependenciesProvider>
        <TestComponent />
      </AppDependenciesProvider>,
    );

    expect(result).toBeDefined();
    expect(result!.db).toBe(mockDb);
  });
});

describe('useAppDependencies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return dependencies when used inside provider', () => {
    let result: ReturnType<typeof useAppDependencies> | null = null;

    function TestComponent() {
      result = useAppDependencies();
      return <View testID="test" />;
    }

    render(
      <AppDependenciesProvider>
        <TestComponent />
      </AppDependenciesProvider>,
    );

    expect(result).toEqual(mockDependencies);
  });

  it('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    function TestComponent() {
      useAppDependencies();
      return <View testID="test" />;
    }

    expect(() => render(<TestComponent />)).toThrow(
      'useAppDependencies must be used within an AppDependenciesProvider',
    );

    consoleError.mockRestore();
  });
});
