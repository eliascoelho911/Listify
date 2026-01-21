/**
 * InlineHighlight Molecule Types
 */

import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

/**
 * Types of highlights that can appear in text
 */
export type HighlightType = 'list' | 'section' | 'price' | 'quantity';

/**
 * Represents a highlighted segment in the text
 */
export interface HighlightSegment {
  /**
   * Type of highlight for styling
   */
  type: HighlightType;

  /**
   * Start position in the text (0-indexed)
   */
  start: number;

  /**
   * End position in the text (exclusive)
   */
  end: number;

  /**
   * The actual text value
   */
  value: string;
}

export interface InlineHighlightProps extends Omit<ViewProps, 'style'> {
  /**
   * The full text to render with highlights
   */
  text: string;

  /**
   * Array of highlights to apply
   */
  highlights: HighlightSegment[];

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional style for normal text
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Whether the text is selectable
   */
  selectable?: boolean;
}
