/**
 * SearchResultCard Molecule Types
 */

import type { StyleProp, ViewStyle } from 'react-native';

export type SearchResultType = 'note' | 'shopping' | 'movie' | 'book' | 'game' | 'list';

export interface HighlightSegment {
  /**
   * Text content of this segment
   */
  text: string;

  /**
   * Whether this segment should be highlighted
   */
  isHighlight: boolean;
}

export interface SearchResultCardProps {
  /**
   * Title of the result
   */
  title: string;

  /**
   * Optional subtitle (e.g., list name, description preview)
   */
  subtitle?: string;

  /**
   * Type of the result (for icon display)
   */
  resultType: SearchResultType;

  /**
   * Search query for highlighting matching text
   */
  searchQuery?: string;

  /**
   * Callback when the card is pressed
   */
  onPress: () => void;

  /**
   * Optional timestamp to display
   */
  timestamp?: Date;

  /**
   * Optional container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
