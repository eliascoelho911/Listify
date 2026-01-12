/**
 * SuggestionsPopUp Molecule Types
 *
 * Molecule inspirada no Command do Shadcn para exibir lista de sugestões acima de um input.
 * Pode ser usada para autocomplete de tags, comandos, etc.
 */

import type { ReactElement } from 'react';
import type { ViewProps } from 'react-native';

export interface SuggestionItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Display label for the item
   */
  label: string;

  /**
   * Optional secondary text
   */
  description?: string;
}

export interface SuggestionsPopUpProps<T extends SuggestionItem = SuggestionItem> extends Omit<
  ViewProps,
  'style'
> {
  /**
   * List of suggestion items
   */
  items: T[];

  /**
   * Callback when an item is selected
   */
  onSelect: (item: T) => void;

  /**
   * Whether the popup is visible
   */
  visible: boolean;

  /**
   * Custom render function for items
   */
  renderItem?: (item: T) => ReactElement;

  /**
   * Message to display when there are no items
   */
  emptyMessage?: string;

  /**
   * Whether the popup is in loading state
   */
  isLoading?: boolean;

  /**
   * Maximum number of items to display
   */
  maxItems?: number;
}
