/**
 * SelectableItemList Molecule Types
 *
 * A list component that displays purchase history items with checkboxes
 * for individual selection. Used for re-adding items from purchase history.
 */

import type { StyleProp, ViewStyle } from 'react-native';

import type { PurchaseHistoryItem } from '@domain/purchase-history/entities/purchase-history.entity';

export interface SelectableItemListItem extends PurchaseHistoryItem {
  /**
   * Whether this item already exists in the current shopping list
   */
  existsInList: boolean;
}

export interface SelectableItemListProps {
  /**
   * Items to display in the list
   */
  items: SelectableItemListItem[];

  /**
   * Set of selected item IDs (using originalItemId)
   */
  selectedIds: Set<string>;

  /**
   * Callback when an item's selection state changes
   */
  onSelectionChange: (itemId: string, selected: boolean) => void;

  /**
   * Callback when "Select All" is triggered
   */
  onSelectAll?: () => void;

  /**
   * Callback when "Deselect All" is triggered
   */
  onDeselectAll?: () => void;

  /**
   * Whether the list is in loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
