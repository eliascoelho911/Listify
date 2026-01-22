/**
 * AddAllButton Atom Types
 *
 * A prominent button for "Buy all again" action in purchase history.
 * Features an icon and label, styled for high visibility.
 */

import type { StyleProp, ViewStyle } from 'react-native';

export interface AddAllButtonProps {
  /**
   * Button label text
   */
  label: string;

  /**
   * Callback when button is pressed
   */
  onPress: () => void;

  /**
   * Number of items to be added (shown in badge)
   */
  itemCount?: number;

  /**
   * Whether the button is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
