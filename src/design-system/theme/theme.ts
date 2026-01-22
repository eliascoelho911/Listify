/**
 * Design System Themes
 *
 * Dark theme (padrão) e Light theme usando tokens cyan/gray
 */

import { animations, AnimationTokens } from '@design-system/tokens';

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
  animations: AnimationTokens;
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
  animations,
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
  animations,
};

/**
 * Theme mode type (user preference)
 * - 'dark': Always dark theme
 * - 'light': Always light theme
 * - 'auto': Follow system preference
 */
export type ThemeMode = 'dark' | 'light' | 'auto';

/**
 * Resolved theme (actual theme being displayed)
 */
export type ResolvedTheme = 'dark' | 'light';
