/**
 * Design System Typography Tokens
 *
 * Fonts:
 * - Body: Fira Sans (sans-serif)
 * - Monospace: Fira Code (monospace)
 *
 * Weights, sizes, and line heights follow a consistent scale
 */

export const families = {
  body: 'Fira Sans',
  mono: 'Fira Code',
};

export const weights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Font sizes (in pixels for React Native)
 * Scale: xs, sm, base, md, lg, xl, 2xl, 3xl, 4xl
 */
export const sizes = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 36,
  '4xl': 48,
};

/**
 * Line heights (relative to font size)
 * Scale: tight, normal, relaxed
 */
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

/**
 * Typography tokens type for TypeScript
 */
export type TypographyTokens = {
  families: typeof families;
  weights: typeof weights;
  sizes: typeof sizes;
  lineHeights: typeof lineHeights;
};
