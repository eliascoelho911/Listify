/**
 * useTheme Hook
 *
 * Hook para consumir ThemeContext em componentes do Design System
 */

import { useContext } from 'react';

import type { ResolvedTheme, Theme, ThemeMode } from './theme';
import { ThemeContext } from './ThemeProvider';

export interface UseThemeReturn {
  theme: Theme;
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export function useTheme(): UseThemeReturn {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
