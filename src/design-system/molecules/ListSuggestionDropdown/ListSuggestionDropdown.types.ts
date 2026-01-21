/**
 * ListSuggestionDropdown Molecule Types
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import type { ListType } from '@domain/list';

/**
 * A list suggestion to display in the dropdown
 */
export interface ListSuggestion {
  /**
   * Unique ID of the list
   */
  id: string;

  /**
   * Name of the list
   */
  name: string;

  /**
   * Type of the list
   */
  listType: ListType;

  /**
   * Optional section names for this list
   */
  sections?: string[];
}

export interface ListSuggestionDropdownProps extends Omit<ViewProps, 'style'> {
  /**
   * List of suggestions to display
   */
  suggestions: ListSuggestion[];

  /**
   * Callback when a list is selected
   */
  onSelectList: (list: ListSuggestion) => void;

  /**
   * Callback when a section is selected
   */
  onSelectSection?: (list: ListSuggestion, sectionName: string) => void;

  /**
   * Whether to show "Create new list" option
   * @default true
   */
  showCreateOption?: boolean;

  /**
   * Callback when "Create new list" is pressed
   */
  onCreateNew?: (name: string) => void;

  /**
   * Text that user is typing (for "Create X" option)
   */
  searchText?: string;

  /**
   * Whether the dropdown is visible
   */
  visible: boolean;

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Maximum number of suggestions to show
   * @default 5
   */
  maxSuggestions?: number;
}
