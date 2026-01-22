/**
 * ColorPicker Molecule Types
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

/**
 * Predefined color options for the picker
 */
export interface ColorOption {
  /** Hex color value */
  value: string;
  /** Display name for accessibility */
  label: string;
}

export interface ColorPickerProps extends Omit<ViewProps, 'style'> {
  /**
   * Array of color options to display
   */
  colors: ColorOption[];

  /**
   * Currently selected color value (hex)
   */
  selectedColor: string | undefined;

  /**
   * Callback when a color is selected
   */
  onSelect: (color: string) => void;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
