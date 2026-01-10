/**
 * Design System Color Tokens
 *
 * Paleta:
 * - Base: Gray "chumbo" (cool gray with slightly blue tint)
 * - Theme: Cyan (vibrant cyan for primary actions)
 * - Shadcn tokens completos
 * - Topbar tokens customizados
 *
 * Suporta dark theme (padrão) e light theme
 */

// Gray "chumbo" palette (cool gray with blue undertones)
export const gray = {
  50: '#f8f9fa',
  100: '#f1f3f5',
  200: '#e9ecef',
  300: '#dee2e6',
  400: '#ced4da',
  500: '#adb5bd',
  600: '#6c757d', // Base "chumbo"
  700: '#495057',
  800: '#343a40',
  900: '#212529',
  950: '#16191d',
};

// Cyan theme palette
export const cyan = {
  50: '#ecfeff',
  100: '#cffafe',
  200: '#a5f3fc',
  300: '#67e8f9',
  400: '#22d3ee',
  500: '#06b6d4', // Primary cyan
  600: '#0891b2',
  700: '#0e7490',
  800: '#155e75',
  900: '#164e63',
  950: '#083344',
};

// Semantic color aliases
export const semantic = {
  success: '#10b981', // Green
  warning: '#f59e0b', // Amber
  error: '#ef4444', // Red
  info: cyan[500],
};

/**
 * Dark Theme Tokens (padrão)
 */
export const darkTheme = {
  // Shadcn base tokens
  background: gray[950],
  foreground: gray[50],

  // Card tokens
  card: gray[900],
  cardForeground: gray[50],

  // Popover tokens
  popover: gray[900],
  popoverForeground: gray[50],

  // Primary tokens (cyan theme)
  primary: cyan[500],
  primaryForeground: gray[950],

  // Secondary tokens
  secondary: gray[800],
  secondaryForeground: gray[50],

  // Muted tokens
  muted: gray[800],
  mutedForeground: gray[400],

  // Accent tokens
  accent: cyan[700],
  accentForeground: gray[50],

  // Destructive tokens
  destructive: semantic.error,
  destructiveForeground: gray[50],

  // Border tokens
  border: gray[800],
  input: gray[800],
  ring: cyan[500],

  // Topbar custom tokens
  topbar: gray[900],
  topbarForeground: gray[50],
  topbarPrimary: cyan[500],
  topbarPrimaryForeground: gray[950],
  topbarAccent: cyan[700],
  topbarAccentForeground: gray[50],
  topbarBorder: gray[800],
  topbarRing: cyan[500],
};

/**
 * Light Theme Tokens
 */
export const lightTheme = {
  // Shadcn base tokens
  background: gray[50],
  foreground: gray[950],

  // Card tokens
  card: 'white',
  cardForeground: gray[950],

  // Popover tokens
  popover: 'white',
  popoverForeground: gray[950],

  // Primary tokens (cyan theme)
  primary: cyan[600],
  primaryForeground: 'white',

  // Secondary tokens
  secondary: gray[200],
  secondaryForeground: gray[950],

  // Muted tokens
  muted: gray[200],
  mutedForeground: gray[600],

  // Accent tokens
  accent: cyan[400],
  accentForeground: gray[950],

  // Destructive tokens
  destructive: semantic.error,
  destructiveForeground: 'white',

  // Border tokens
  border: gray[300],
  input: gray[300],
  ring: cyan[600],

  // Topbar custom tokens
  topbar: gray[100],
  topbarForeground: gray[950],
  topbarPrimary: cyan[600],
  topbarPrimaryForeground: 'white',
  topbarAccent: cyan[400],
  topbarAccentForeground: gray[950],
  topbarBorder: gray[300],
  topbarRing: cyan[600],
};

/**
 * Color tokens type for TypeScript
 */
export type ColorTokens = typeof darkTheme;
