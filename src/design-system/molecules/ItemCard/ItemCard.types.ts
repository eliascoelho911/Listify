/**
 * ItemCard Molecule Types
 *
 * Generic card for displaying items of any type in the Inbox.
 * Renders differently based on item type (note, shopping, movie, book, game).
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import type { Item } from '@domain/item/entities/item.entity';

export interface ItemCardProps extends Omit<ViewProps, 'style'> {
  /**
   * The item to display
   */
  item: Item;

  /**
   * Optional list name to display (for Inbox context)
   */
  listName?: string;

  /**
   * Whether to show the list badge
   * @default true
   */
  showListBadge?: boolean;

  /**
   * Callback when item card is pressed
   */
  onPress?: (item: Item) => void;

  /**
   * Callback when long press is triggered (for context menu)
   */
  onLongPress?: (item: Item) => void;

  /**
   * Whether the item is currently selected
   */
  selected?: boolean;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;
}
