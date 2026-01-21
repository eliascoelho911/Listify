/**
 * ScreenTitle Atom Types
 */

import type { StyleProp, TextStyle } from 'react-native';

export interface ScreenTitleProps {
  /**
   * Title text to display
   */
  title: string;

  /**
   * Optional subtitle text
   */
  subtitle?: string;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Custom title style
   */
  titleStyle?: StyleProp<TextStyle>;

  /**
   * Custom subtitle style
   */
  subtitleStyle?: StyleProp<TextStyle>;
}
