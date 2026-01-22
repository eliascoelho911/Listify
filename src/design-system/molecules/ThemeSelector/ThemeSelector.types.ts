/**
 * ThemeSelector Molecule Types
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

/**
 * Theme options available for selection
 */
export type ThemeOption = 'light' | 'dark' | 'auto';

export interface ThemeSelectorProps extends Omit<ViewProps, 'style'> {
  /**
   * Currently selected theme
   */
  selectedTheme: ThemeOption;

  /**
   * Callback when theme is selected
   */
  onSelect: (theme: ThemeOption) => void;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
