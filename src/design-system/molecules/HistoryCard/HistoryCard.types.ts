/**
 * HistoryCard Molecule Types
 *
 * Card for displaying purchase history entries.
 * Shows date, total value, and item count.
 */

import type { StyleProp, ViewStyle } from 'react-native';

export interface HistoryCardProps {
  /**
   * Purchase date to display
   */
  purchaseDate: Date;

  /**
   * Total value of the purchase
   */
  totalValue: number;

  /**
   * Number of items in the purchase
   */
  itemCount: number;

  /**
   * Callback when the card is pressed
   */
  onPress?: () => void;

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
