/**
 * ShoppingItemCard Molecule Types
 *
 * Card component specifically for shopping list items.
 * Displays item title, quantity, price, and checkbox for marking as purchased.
 */

import type { StyleProp, ViewStyle } from 'react-native';

import type { ShoppingItem } from '@domain/item/entities/item.entity';

export interface ShoppingItemCardProps {
  /**
   * The shopping item to display
   */
  item: ShoppingItem;

  /**
   * Callback when the checkbox is toggled
   */
  onToggle?: (item: ShoppingItem, checked: boolean) => void;

  /**
   * Callback when the card is pressed (for editing)
   */
  onPress?: (item: ShoppingItem) => void;

  /**
   * Callback when the card is long pressed (for context menu or drag)
   * Not used when showDragHandle is true
   */
  onLongPress?: (item: ShoppingItem) => void;

  /**
   * Whether the card is currently selected (for multi-select mode)
   * @default false
   */
  selected?: boolean;

  /**
   * Whether to show the drag handle for reordering
   * @default false
   */
  showDragHandle?: boolean;

  /**
   * Whether the item is currently being dragged
   * @default false
   */
  isDragging?: boolean;

  /**
   * Callback to initiate drag (from react-native-draggable-flatlist)
   */
  onDrag?: () => void;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
