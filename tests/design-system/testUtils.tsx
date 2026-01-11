/**
 * Design System Test Utilities
 *
 * Provides test helpers for rendering components with ThemeProvider
 * Mocks async dependencies (fonts, AsyncStorage, SplashScreen)
 */

import React from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';

import { ThemeProvider } from '@design-system/theme';
import type { ThemeMode } from '@design-system/theme/theme';

// Mock expo-font to avoid async font loading in tests
jest.mock('expo-font', () => ({
  loadAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

interface RenderWithThemeOptions extends Omit<RenderOptions, 'wrapper'> {
  initialMode?: ThemeMode;
}

/**
 * Renders a component wrapped in ThemeProvider for testing
 * Automatically handles async font loading and theme setup
 */
export function renderWithTheme(component: React.ReactElement, options?: RenderWithThemeOptions) {
  const { initialMode = 'dark', ...renderOptions } = options ?? {};

  return render(<ThemeProvider initialMode={initialMode}>{component}</ThemeProvider>, {
    ...renderOptions,
  });
}
