/**
 * Text Atom Types
 */

import type { StyleProp, TextProps as RNTextProps, TextStyle } from 'react-native';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodySmall'
  | 'bodyLarge'
  | 'caption'
  | 'label'
  | 'mono';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type TextColor =
  | 'foreground'
  | 'mutedForeground'
  | 'cardForeground'
  | 'primaryForeground'
  | 'secondaryForeground'
  | 'destructiveForeground'
  | 'primary'
  | 'destructive'
  | 'muted';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  /**
   * Text content
   */
  children: React.ReactNode;

  /**
   * Typography variant
   * @default 'body'
   */
  variant?: TextVariant;

  /**
   * Text color using theme tokens
   * @default 'foreground'
   */
  color?: TextColor;

  /**
   * Override font weight
   */
  weight?: TextWeight;

  /**
   * Text alignment
   * @default 'left'
   */
  align?: TextAlign;

  /**
   * Additional styles
   */
  style?: StyleProp<TextStyle>;
}
