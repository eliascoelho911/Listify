/**
 * SearchInput Molecule Types
 */

import type { StyleProp, ViewStyle } from 'react-native';

export interface SearchInputProps {
  /**
   * Current search query value
   */
  value: string;

  /**
   * Callback when search query changes
   */
  onChangeText: (text: string) => void;

  /**
   * Callback when user submits the search
   */
  onSubmit?: () => void;

  /**
   * Callback when clear button is pressed
   */
  onClear?: () => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Whether the input should auto-focus on mount
   */
  autoFocus?: boolean;

  /**
   * Optional container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
