/**
 * Design System Barrel Export
 *
 * Central export point for the entire Design System.
 * Import components, tokens, theme, and utilities from here.
 *
 * @example
 * import { Button, Input, useTheme, colors } from '@design-system';
 */

// Tokens
export * from './tokens';

// Theme
export { ThemeProvider, useTheme } from './theme';
export type { Theme, ThemeMode } from './theme/theme';

// Atoms
export * from './atoms';

// Molecules
export * from './molecules';

// Organisms
export * from './organisms';

// Templates (empty for now, will be populated later)
// export * from './templates';

// Pages (empty for now, will be populated later)
// export * from './pages';

// Utils
export * from './utils';
