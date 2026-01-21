/**
 * SearchHistory Molecule Types
 */

import type { StyleProp, ViewStyle } from 'react-native';

export interface SearchHistoryItem {
  /**
   * Unique identifier for the history entry
   */
  id: string;

  /**
   * The search query text
   */
  query: string;

  /**
   * When the search was performed
   */
  searchedAt: Date;
}

export interface SearchHistoryProps {
  /**
   * List of recent search history entries
   */
  entries: SearchHistoryItem[];

  /**
   * Callback when a history entry is selected
   */
  onSelectEntry: (query: string) => void;

  /**
   * Callback when a history entry is deleted
   */
  onDeleteEntry?: (id: string) => void;

  /**
   * Callback when all history is cleared
   */
  onClearAll?: () => void;

  /**
   * Title for the history section
   */
  title?: string;

  /**
   * Optional container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
