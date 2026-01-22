/**
 * SmartInputModal Organism Types
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import type { MediaSearchResult, ParsedInput } from '@domain/common';

import type { ListSuggestion } from '../../molecules/ListSuggestionDropdown/ListSuggestionDropdown.types';
import type { MediaType } from '../../molecules/MediaSearchDropdown/MediaSearchDropdown.types';
import type { SelectableListType } from '../../molecules/MiniCategorySelector/MiniCategorySelector.types';

/**
 * Input mode for SmartInputModal
 * - 'item': Create items (default behavior with @mention, :section, price parsing)
 * - 'list': Create lists (simple name input with category selector)
 */
export type SmartInputMode = 'item' | 'list';

export interface SmartInputModalProps extends Omit<ViewProps, 'style'> {
  /**
   * Input mode
   * @default 'item'
   */
  mode?: SmartInputMode;
  /**
   * Whether the modal is visible
   */
  visible: boolean;

  /**
   * Callback when modal should be closed
   */
  onClose: () => void;

  /**
   * Callback when user submits the input
   */
  onSubmit: (parsed: ParsedInput) => void;

  /**
   * Current input text
   */
  value: string;

  /**
   * Callback when input text changes
   */
  onChangeText: (text: string) => void;

  /**
   * Current parsed result (from parser service)
   */
  parsed: ParsedInput;

  /**
   * List suggestions to show in dropdown
   */
  listSuggestions: ListSuggestion[];

  /**
   * Whether list suggestions dropdown is visible
   */
  showSuggestions: boolean;

  /**
   * Callback when a list is selected from suggestions
   */
  onSelectList: (list: ListSuggestion) => void;

  /**
   * Callback when "Create new list" is pressed
   */
  onCreateList?: (name: string) => void;

  /**
   * Placeholder text for input
   * @default "Digite para adicionar..."
   */
  placeholder?: string;

  /**
   * Whether the input is in loading state
   */
  isLoading?: boolean;

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Name of the current list context (for :section syntax)
   */
  currentListName?: string;

  /**
   * Whether current list is a shopping list (enables price extraction)
   */
  isShoppingList?: boolean;

  /**
   * Whether to show the category selector
   */
  showCategorySelector?: boolean;

  /**
   * Name of the list being created (for category selector)
   */
  pendingListName?: string;

  /**
   * Inferred category type (for category selector)
   */
  inferredCategoryType?: SelectableListType;

  /**
   * Callback when a category is selected
   */
  onSelectCategory?: (type: SelectableListType) => void;

  /**
   * Callback when category selection is cancelled
   */
  onCancelCategorySelection?: () => void;

  /**
   * Whether to keep modal open after submit (for continuous creation)
   * @default true
   */
  keepOpen?: boolean;

  /**
   * Media search mode - for interest lists (movies, books, games)
   * When set, shows media search dropdown instead of list suggestions
   */
  mediaSearchMode?: MediaType;

  /**
   * Media search results from external provider
   */
  mediaSearchResults?: MediaSearchResult[];

  /**
   * Whether media search is in progress
   */
  isMediaSearchLoading?: boolean;

  /**
   * Media search error message
   */
  mediaSearchError?: string;

  /**
   * Callback when a media search result is selected
   */
  onSelectMediaResult?: (result: MediaSearchResult) => void;

  /**
   * Callback for manual entry when no media result matches
   */
  onManualMediaEntry?: (title: string) => void;
}
