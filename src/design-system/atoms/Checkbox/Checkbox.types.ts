/**
 * Checkbox Atom Types
 */

import type { StyleProp, ViewStyle } from 'react-native';

export interface CheckboxProps {
  /**
   * Whether the checkbox is checked
   */
  checked: boolean;

  /**
   * Callback when the checkbox is toggled
   */
  onToggle?: (checked: boolean) => void;

  /**
   * Whether the checkbox is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Size variant of the checkbox
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
