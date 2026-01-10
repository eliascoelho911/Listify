/**
 * Tests for ThemeProvider Component
 *
 * Validates:
 * - Dark theme as default
 * - Theme switching functionality
 * - AsyncStorage persistence
 * - useTheme hook functionality
 */

import React from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, waitFor } from '@testing-library/react-native';

import { ThemeProvider, useTheme } from '@design-system/theme';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// Test component that uses useTheme
function TestComponent() {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <>
      <Text testID="mode">{mode}</Text>
      <Text testID="primary-color">{theme.colors.primary}</Text>
      <Text testID="font-family">{theme.typography.families.body}</Text>
      <Text testID="toggle-button" onPress={toggleTheme}>
        Toggle
      </Text>
    </>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('should provide dark theme as default', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(getByTestId('mode').props.children).toBe('dark');
    });
  });

  it('should provide theme tokens to children', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(getByTestId('font-family').props.children).toBe('Fira Sans');
      expect(getByTestId('primary-color').props.children).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  it('should load theme preference from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('light');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(getByTestId('mode').props.children).toBe('light');
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@listify:theme');
  });

  it('should use dark theme when no stored preference', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(getByTestId('mode').props.children).toBe('dark');
    });
  });
});

describe('useTheme hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('should throw error when used outside ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleError.mockRestore();
  });

  it('should provide theme object', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await waitFor(() => {
      const primaryColor = getByTestId('primary-color').props.children;
      expect(primaryColor).toBeTruthy();
      expect(typeof primaryColor).toBe('string');
    });
  });

  it('should provide mode string', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await waitFor(() => {
      const mode = getByTestId('mode').props.children;
      expect(['dark', 'light']).toContain(mode);
    });
  });

  it('should provide toggleTheme function', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await waitFor(() => {
      const toggleButton = getByTestId('toggle-button');
      expect(toggleButton.props.onPress).toBeInstanceOf(Function);
    });
  });
});
