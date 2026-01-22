/**
 * EditModal Organism Types
 */

import type { StyleProp, ViewStyle } from 'react-native';

import type { ParsedInput } from '@domain/common';
import type { Item, ShoppingItem } from '@domain/item';

/**
 * Edit modal mode - determines which item type is being edited
 */
export type EditModalItemType = 'shopping' | 'note' | 'movie' | 'book' | 'game';

/**
 * Data returned when user submits an edit
 */
export interface EditSubmitData {
  /** Parsed input from the smart parser */
  parsed: ParsedInput;
  /** Updated item data based on parsed input */
  updates: {
    title: string;
    quantity?: string;
    price?: number;
    sectionId?: string;
  };
}

export interface EditModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;

  /**
   * The item being edited
   */
  item: Item | null;

  /**
   * Callback when modal should be closed
   */
  onClose: () => void;

  /**
   * Callback when user submits the edited item
   */
  onSubmit: (data: EditSubmitData) => void;

  /**
   * Callback when user requests to delete the item
   */
  onDelete?: (item: Item) => void;

  /**
   * Whether the modal is in a loading state
   */
  isLoading?: boolean;

  /**
   * Placeholder text for the input
   * @default "Editar item..."
   */
  placeholder?: string;

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Helper to convert a shopping item to its editable string representation
 * Format: "title quantity R$price"
 */
export function shoppingItemToEditableString(item: ShoppingItem): string {
  const parts: string[] = [item.title];

  if (item.quantity) {
    parts.push(item.quantity);
  }

  if (item.price !== undefined && item.price > 0) {
    // Format as R$XX,XX
    parts.push(`R$${item.price.toFixed(2).replace('.', ',')}`);
  }

  return parts.join(' ');
}
