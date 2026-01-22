/**
 * MediaCard Molecule Types
 *
 * Card component for displaying movie, book, or game items
 * with cover image, title, metadata, and checked state.
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import type { BookItem, GameItem, MovieItem } from '@domain/item';

/**
 * Media type for icon and label selection
 */
export type MediaCardType = 'movie' | 'book' | 'game';

/**
 * Union of all media item types
 */
export type MediaItem = MovieItem | BookItem | GameItem;

/**
 * Props for the MediaCard component
 */
export interface MediaCardProps extends Omit<ViewProps, 'style'> {
  /**
   * The media item to display
   */
  item: MediaItem;

  /**
   * Callback when the card is pressed
   */
  onPress?: (item: MediaItem) => void;

  /**
   * Callback when the card is long-pressed (for context menu)
   */
  onLongPress?: (item: MediaItem) => void;

  /**
   * Callback when the checkbox is toggled
   */
  onToggleChecked?: (item: MediaItem, isChecked: boolean) => void;

  /**
   * Whether the card is in a disabled state
   */
  disabled?: boolean;

  /**
   * Whether to show the checkbox
   * @default true
   */
  showCheckbox?: boolean;

  /**
   * Whether to show the rating badge
   * @default true
   */
  showRating?: boolean;

  /**
   * Whether to show the year
   * @default true
   */
  showYear?: boolean;

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional test ID for testing
   */
  testID?: string;
}

/**
 * Configuration for each media type
 */
export interface MediaTypeConfig {
  icon: LucideIcon;
  label: string;
  checkedLabel: string;
}
