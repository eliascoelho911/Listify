/**
 * TotalBar Molecule Types
 *
 * Bottom bar that displays the total value of a shopping list.
 * Shows the sum of all priced items and optionally indicates items without prices.
 */

import type { StyleProp, ViewStyle } from 'react-native';

export interface TotalBarProps {
  /**
   * Total value to display (sum of all item prices)
   */
  total: number;

  /**
   * Number of items that are checked (purchased)
   */
  checkedCount: number;

  /**
   * Total number of items in the list
   */
  totalCount: number;

  /**
   * Number of items without a price value
   * @default 0
   */
  itemsWithoutPrice?: number;

  /**
   * Currency code for formatting
   * @default 'BRL'
   */
  currency?: string;

  /**
   * Locale for number formatting
   * @default 'pt-BR'
   */
  locale?: string;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
