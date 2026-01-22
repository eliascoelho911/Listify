/**
 * Design System Color Tokens
 *
 * Paleta:
 * - Base: Gray "chumbo" (cool gray with slightly blue tint)
 * - Theme: Cyan (vibrant cyan for primary actions)
 * - Accent: Purple (complementary to cyan for visual interest)
 * - Shadcn tokens completos
 * - Topbar tokens customizados
 * - Glow/gradient effect tokens
 *
 * Suporta dark theme (padrão) e light theme
 */

// Special values
export const transparent = 'transparent';

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

// Purple accent palette (complementary to cyan)
export const purple = {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7', // Main accent
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
  950: '#3b0764',
};

// Semantic color aliases
export const semantic = {
  success: '#10b981', // Green
  warning: '#f59e0b', // Amber
  error: '#ef4444', // Red
  info: cyan[500],
};

// Glow and gradient effect tokens
export const effects = {
  // Cyan glow for primary elements
  cyanGlow: 'rgba(6, 182, 212, 0.25)',
  cyanGlowStrong: 'rgba(6, 182, 212, 0.4)',

  // Purple glow for accent elements
  purpleGlow: 'rgba(168, 85, 247, 0.25)',
  purpleGlowStrong: 'rgba(168, 85, 247, 0.4)',

  // Gradient stops for bottom bar and elevated surfaces
  gradientDark: 'rgba(22, 25, 29, 0.95)',
  gradientMid: 'rgba(33, 37, 41, 0.98)',
};

// Item type colors (used in ItemCard and list icons)
export const itemTypeColors = {
  note: '#64748b', // Slate gray
  shopping: '#22c55e', // Green
  movie: '#f43f5e', // Rose
  book: '#8b5cf6', // Violet
  game: '#3b82f6', // Blue
};

/**
 * Dark Theme Tokens (padrão)
 */
export const darkTheme = {
  // Special values
  transparent,

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
  primaryHover: cyan[400], // Hover state - lighter
  primaryActive: cyan[600], // Pressed state - darker

  // Secondary tokens
  secondary: gray[800],
  secondaryForeground: gray[50],

  // Muted tokens
  muted: gray[800],
  mutedForeground: gray[400],

  // Accent tokens (purple for visual interest)
  accent: purple[500],
  accentForeground: gray[50],
  accentSubtle: purple[950], // Subtle background for accent elements

  // Destructive tokens
  destructive: semantic.error,
  destructiveForeground: gray[50],

  // Border tokens
  border: gray[800],
  input: gray[800],
  ring: cyan[500],

  // Surface tokens
  surface: gray[900],
  surfaceForeground: gray[50],
  elevated: gray[700], // For floating elements with more contrast

  // Overlay and shadow base colors
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  shadowBase: '#000',

  // Item type colors
  itemNote: itemTypeColors.note,
  itemShopping: itemTypeColors.shopping,
  itemMovie: itemTypeColors.movie,
  itemBook: itemTypeColors.book,
  itemGame: itemTypeColors.game,

  // Bottombar tokens (elevated surface with more contrast)
  bottombar: gray[900], // Darker for more contrast
  bottombarBorder: gray[700],
  bottombarActive: cyan[500], // Active icon color
  bottombarActiveGlow: 'rgba(6, 182, 212, 0.2)', // Glow effect for active state

  // Feedback visual tokens (subtle backgrounds)
  successSubtle: 'rgba(16, 185, 129, 0.15)',
  warningSubtle: 'rgba(245, 158, 11, 0.15)',
  errorSubtle: 'rgba(239, 68, 68, 0.15)',

  // Glow tokens
  ringGlow: 'rgba(6, 182, 212, 0.3)',
  accentGlow: 'rgba(168, 85, 247, 0.25)',

  // Gradient tokens
  gradientStart: gray[950],
  gradientEnd: gray[900],
};

/**
 * Light Theme Tokens
 */
export const lightTheme = {
  // Special values
  transparent,

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
  primaryHover: cyan[500], // Hover state - lighter
  primaryActive: cyan[700], // Pressed state - darker

  // Secondary tokens
  secondary: gray[200],
  secondaryForeground: gray[950],

  // Muted tokens
  muted: gray[200],
  mutedForeground: gray[600],

  // Accent tokens (purple for visual interest)
  accent: purple[400], // Lighter for light theme
  accentForeground: gray[950],
  accentSubtle: purple[100], // Subtle background for accent elements

  // Destructive tokens
  destructive: semantic.error,
  destructiveForeground: 'white',

  // Border tokens
  border: gray[300],
  input: gray[300],
  ring: cyan[600],

  // Surface tokens
  surface: 'white',
  surfaceForeground: gray[950],
  elevated: gray[200], // For floating elements

  // Overlay and shadow base colors
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  shadowBase: '#000',

  // Item type colors
  itemNote: itemTypeColors.note,
  itemShopping: itemTypeColors.shopping,
  itemMovie: itemTypeColors.movie,
  itemBook: itemTypeColors.book,
  itemGame: itemTypeColors.game,

  // Bottombar tokens (elevated surface with more contrast)
  bottombar: gray[100],
  bottombarBorder: gray[300],
  bottombarActive: cyan[600], // Active icon color
  bottombarActiveGlow: 'rgba(8, 145, 178, 0.15)', // Glow effect for active state

  // Feedback visual tokens (subtle backgrounds - more subtle for light theme)
  successSubtle: 'rgba(16, 185, 129, 0.1)',
  warningSubtle: 'rgba(245, 158, 11, 0.1)',
  errorSubtle: 'rgba(239, 68, 68, 0.1)',

  // Glow tokens
  ringGlow: 'rgba(8, 145, 178, 0.2)',
  accentGlow: 'rgba(168, 85, 247, 0.15)',

  // Gradient tokens
  gradientStart: gray[50],
  gradientEnd: 'white',
};

/**
 * Color tokens type for TypeScript
 */
export type ColorTokens = typeof darkTheme;
