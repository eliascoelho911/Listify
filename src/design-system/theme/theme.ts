/**
 * Design System Themes
 *
 * Dark theme (padrão) e Light theme usando tokens cyan/gray
 */

import type { ColorTokens } from '../tokens/colors';
import { darkTheme as darkColors, lightTheme as lightColors } from '../tokens/colors';
import type { RadiiTokens } from '../tokens/radii';
import { radii } from '../tokens/radii';
import type { ShadowTokens } from '../tokens/shadows';
import { shadows } from '../tokens/shadows';
import type { SpacingTokens } from '../tokens/spacing';
import { spacing } from '../tokens/spacing';
import type { TypographyTokens } from '../tokens/typography';
import { families, lineHeights, sizes, weights } from '../tokens/typography';

/**
 * Theme object structure
 */
export interface Theme {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radii: RadiiTokens;
  shadows: ShadowTokens;
}

/**
 * Dark Theme (padrão)
 */
export const darkTheme: Theme = {
  colors: darkColors,
  typography: {
    families,
    weights,
    sizes,
    lineHeights,
  },
  spacing,
  radii,
  shadows,
};

/**
 * Light Theme
 */
export const lightTheme: Theme = {
  colors: lightColors,
  typography: {
    families,
    weights,
    sizes,
    lineHeights,
  },
  spacing,
  radii,
  shadows,
};

/**
 * Theme mode type
 */
export type ThemeMode = 'dark' | 'light';
