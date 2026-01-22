/**
 * CompleteButton Molecule Types
 *
 * Button for completing a purchase and saving to history.
 */

import type { StyleProp, ViewStyle } from 'react-native';

export interface CompleteButtonProps {
  /**
   * Callback when the complete purchase button is pressed
   */
  onPress: () => void;

  /**
   * Total value of the purchase
   */
  total: number;

  /**
   * Number of items checked/selected
   */
  checkedCount: number;

  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom label for the button
   * @default "Concluir compra"
   */
  label?: string;

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
