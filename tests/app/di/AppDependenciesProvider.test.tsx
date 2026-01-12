/**
 * AppDependenciesProvider Tests
 *
 * Tests for the DI provider and hooks.
 */

import React from 'react';
import { View } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

import {
  AppDependenciesProvider,
  useAppDependencies,
  useInboxRepository,
  useShoppingRepository,
} from '@app/di/AppDependenciesProvider';

// Mock buildDependencies
const mockDependencies = {
  database: { name: 'test-db' },
  shoppingRepository: { name: 'shopping-repo' },
  inboxRepository: { name: 'inbox-repo' },
};

jest.mock('@app/di/container', () => ({
  buildDependencies: jest.fn(),
}));

const { buildDependencies } = jest.requireMock('@app/di/container');

describe('AppDependenciesProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buildDependencies.mockResolvedValue(mockDependencies);
  });

  it('should show fallback while loading', () => {
    buildDependencies.mockImplementation(() => new Promise(() => {}));

    const { getByTestId } = render(
      <AppDependenciesProvider fallback={<View testID="loading" />}>
        <View testID="content" />
      </AppDependenciesProvider>,
    );

    expect(getByTestId('loading')).toBeTruthy();
  });

  it('should render children when dependencies are loaded', async () => {
    const { getByTestId } = render(
      <AppDependenciesProvider>
        <View testID="content" />
      </AppDependenciesProvider>,
    );

    await waitFor(() => {
      expect(getByTestId('content')).toBeTruthy();
    });
  });

  it('should show error fallback when build fails', async () => {
    const error = new Error('Build failed');
    buildDependencies.mockRejectedValue(error);

    const errorFallback = () => <View testID="error" />;

    const { getByTestId } = render(
      <AppDependenciesProvider errorFallback={errorFallback}>
        <View testID="content" />
      </AppDependenciesProvider>,
    );

    await waitFor(() => {
      expect(getByTestId('error')).toBeTruthy();
    });
  });

  it('should pass options to buildDependencies', async () => {
    const options = { databaseName: 'custom.db' };

    render(
      <AppDependenciesProvider options={options}>
        <View testID="content" />
      </AppDependenciesProvider>,
    );

    await waitFor(() => {
      expect(buildDependencies).toHaveBeenCalledWith(options);
    });
  });
});

describe('useAppDependencies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buildDependencies.mockResolvedValue(mockDependencies);
  });

  it('should return dependencies when used inside provider', async () => {
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

    await waitFor(() => {
      expect(result).toEqual(mockDependencies);
    });
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

describe('useInboxRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buildDependencies.mockResolvedValue(mockDependencies);
  });

  it('should return inbox repository', async () => {
    let result: ReturnType<typeof useInboxRepository> | null = null;

    function TestComponent() {
      result = useInboxRepository();
      return <View testID="test" />;
    }

    render(
      <AppDependenciesProvider>
        <TestComponent />
      </AppDependenciesProvider>,
    );

    await waitFor(() => {
      expect(result).toEqual(mockDependencies.inboxRepository);
    });
  });
});

describe('useShoppingRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buildDependencies.mockResolvedValue(mockDependencies);
  });

  it('should return shopping repository', async () => {
    let result: ReturnType<typeof useShoppingRepository> | null = null;

    function TestComponent() {
      result = useShoppingRepository();
      return <View testID="test" />;
    }

    render(
      <AppDependenciesProvider>
        <TestComponent />
      </AppDependenciesProvider>,
    );

    await waitFor(() => {
      expect(result).toEqual(mockDependencies.shoppingRepository);
    });
  });
});
