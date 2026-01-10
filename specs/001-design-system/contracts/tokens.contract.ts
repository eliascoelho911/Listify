/**
 * CONTRATO PÚBLICO: Design Tokens
 *
 * Define as interfaces públicas para todos os tokens de design.
 * Estes tokens são a fundação do Design System e devem ser usados
 * por todos os componentes.
 *
 * @module @design-system/tokens
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

/**
 * Formato de cor HSL seguindo padrão Shadcn
 * Formato: "H S% L%" (hue saturation lightness)
 *
 * @example "220 14.3% 95.9%"
 */
export type ColorValue = string;

/**
 * Tokens de cor Shadcn padrão
 */
export interface ShadcnColors {
  background: ColorValue;
  foreground: ColorValue;

  card: ColorValue;
  cardForeground: ColorValue;

  popover: ColorValue;
  popoverForeground: ColorValue;

  primary: ColorValue;
  primaryForeground: ColorValue;

  secondary: ColorValue;
  secondaryForeground: ColorValue;

  muted: ColorValue;
  mutedForeground: ColorValue;

  accent: ColorValue;
  accentForeground: ColorValue;

  destructive: ColorValue;
  destructiveForeground: ColorValue;

  border: ColorValue;
  input: ColorValue;
  ring: ColorValue;
}

/**
 * Tokens de cor customizados para topbar
 */
export interface TopbarColors {
  topbar: ColorValue;
  topbarForeground: ColorValue;

  topbarPrimary: ColorValue;
  topbarPrimaryForeground: ColorValue;

  topbarAccent: ColorValue;
  topbarAccentForeground: ColorValue;

  topbarBorder: ColorValue;
  topbarRing: ColorValue;
}

/**
 * Paleta completa de cores do Design System
 * Inclui tokens Shadcn + topbar customizados + paletas base
 */
export interface Colors extends ShadcnColors, TopbarColors {
  /** Paleta base: Gray "chumbo" */
  gray: {
    50: ColorValue;
    100: ColorValue;
    200: ColorValue;
    300: ColorValue;
    400: ColorValue;
    500: ColorValue; // Base "chumbo"
    600: ColorValue;
    700: ColorValue;
    800: ColorValue;
    900: ColorValue;
  };

  /** Tema principal: Cyan */
  cyan: {
    50: ColorValue;
    100: ColorValue;
    200: ColorValue;
    300: ColorValue;
    400: ColorValue;
    500: ColorValue; // Cyan principal
    600: ColorValue;
    700: ColorValue;
    800: ColorValue;
    900: ColorValue;
  };
}

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

/**
 * Famílias de fonte do Design System
 */
export interface FontFamilies {
  /** Sans-serif principal: Fira Sans */
  body: 'Fira Sans';
  /** Monospace para código: Fira Code */
  mono: 'Fira Code';
}

/**
 * Pesos de fonte disponíveis
 */
export type FontWeight = 400 | 500 | 600 | 700;

/**
 * Pesos de fonte mapeados
 */
export interface FontWeights {
  regular: 400;
  medium: 500;
  semibold: 600;
  bold: 700;
}

/**
 * Tamanhos de fonte (pixels)
 */
export interface FontSizes {
  xs: number;    // 12px
  sm: number;    // 14px
  base: number;  // 16px
  lg: number;    // 18px
  xl: number;    // 20px
  '2xl': number; // 24px
  '3xl': number; // 30px
  '4xl': number; // 36px
}

/**
 * Line heights
 */
export interface LineHeights {
  tight: number;   // 1.2
  normal: number;  // 1.5
  relaxed: number; // 1.75
}

/**
 * Tokens de tipografia completos
 */
export interface Typography {
  families: FontFamilies;
  weights: FontWeights;
  sizes: FontSizes;
  lineHeights: LineHeights;
}

// ============================================================================
// SPACING TOKENS
// ============================================================================

/**
 * Escala de espaçamento compacta
 * Valores menores que Shadcn padrão para UI mais densa
 */
export interface Spacing {
  xs: number;   // 4px
  sm: number;   // 8px
  md: number;   // 12px
  lg: number;   // 16px
  xl: number;   // 24px
  xxl: number;  // 32px
}

// ============================================================================
// RADIUS TOKENS
// ============================================================================

/**
 * Border radius - Large scale
 * Padrão é lg (16px)
 */
export interface Radii {
  none: number;   // 0px
  sm: number;     // 8px (small exceptions)
  md: number;     // 12px (medium)
  lg: number;     // 16px (large - padrão)
  xl: number;     // 24px (extra large)
  full: number;   // 9999px (circular)
}

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

/**
 * Durações de animação (milliseconds)
 */
export interface AnimationDurations {
  fast: number;     // 150ms - micro-interactions
  normal: number;   // 300ms - standard transitions
  slow: number;     // 500ms - complex animations
}

/**
 * Easing curves (cubic-bezier)
 */
export interface AnimationEasings {
  easeIn: string;      // cubic-bezier(0.4, 0, 1, 1)
  easeOut: string;     // cubic-bezier(0, 0, 0.2, 1)
  easeInOut: string;   // cubic-bezier(0.4, 0, 0.2, 1)
  spring: string;      // cubic-bezier(0.34, 1.56, 0.64, 1) - bounce
}

/**
 * Tokens de animação completos
 */
export interface Animations {
  durations: AnimationDurations;
  easings: AnimationEasings;
}

// ============================================================================
// SHADOW TOKENS
// ============================================================================

/**
 * React Native shadow style
 */
export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}

/**
 * Elevation levels (sombras)
 */
export interface Shadows {
  none: ShadowStyle;
  sm: ShadowStyle;    // Elevation 1
  md: ShadowStyle;    // Elevation 2
  lg: ShadowStyle;    // Elevation 3
  xl: ShadowStyle;    // Elevation 4
}

// ============================================================================
// AGGREGATED TOKENS
// ============================================================================

/**
 * Todos os tokens de design agregados
 * Interface pública principal do módulo de tokens
 *
 * @example
 * ```ts
 * import { tokens } from '@design-system/tokens';
 *
 * const buttonStyle = {
 *   padding: tokens.spacing.md,
 *   borderRadius: tokens.radii.lg,
 *   fontFamily: tokens.typography.families.body,
 * };
 * ```
 */
export interface DesignTokens {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  radii: Radii;
  animations: Animations;
  shadows: Shadows;
}

/**
 * Exportação padrão do módulo de tokens
 */
export const tokens: DesignTokens;
