/**
 * Design System Spacing Tokens
 *
 * Escala compacta (menores que padrão Shadcn)
 * Para densidade de informação e menos atrito
 *
 * Valores em pixels (React Native)
 */

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  '3xl': 48,
  '4xl': 64,
};

/**
 * Spacing tokens type for TypeScript
 */
export type SpacingTokens = typeof spacing;
