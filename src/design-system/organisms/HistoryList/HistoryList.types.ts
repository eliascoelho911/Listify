/**
 * HistoryList Organism Types
 *
 * List of purchase history entries.
 * Displays multiple HistoryCard components.
 */

import type { StyleProp, ViewStyle } from 'react-native';

export interface HistoryEntry {
  /**
   * Unique identifier for the history entry
   */
  id: string;

  /**
   * Purchase date
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
}

export interface HistoryListProps {
  /**
   * List of history entries to display
   */
  entries: HistoryEntry[];

  /**
   * Callback when a history entry is pressed
   */
  onEntryPress?: (entry: HistoryEntry) => void;

  /**
   * Whether the list is in a loading state
   */
  isLoading?: boolean;

  /**
   * Title text for empty state
   */
  emptyTitle?: string;

  /**
   * Description text for empty state
   */
  emptyDescription?: string;

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
