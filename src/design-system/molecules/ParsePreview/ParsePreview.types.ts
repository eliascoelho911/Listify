/**
 * ParsePreview Molecule Types
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

/**
 * Represents a parsed element to display as a chip
 */
export interface ParsedElement {
  /**
   * Type of the parsed element
   */
  type: 'list' | 'section' | 'price' | 'quantity';

  /**
   * Display value for the chip
   */
  value: string;

  /**
   * Optional label override (e.g., "Lista" instead of showing the type)
   */
  label?: string;
}

export interface ParsePreviewProps extends Omit<ViewProps, 'style'> {
  /**
   * Array of parsed elements to display as chips
   */
  elements: ParsedElement[];

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional callback when a chip is pressed
   */
  onElementPress?: (element: ParsedElement) => void;

  /**
   * Whether to show labels for each element type
   * @default false
   */
  showLabels?: boolean;
}
