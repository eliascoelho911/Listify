/**
 * MediaSearchDropdown Molecule Types
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import type { MediaSearchResult } from '@domain/common/ports/media-provider.port';

/**
 * Media type for determining icons and labels
 */
export type MediaType = 'movie' | 'book' | 'game';

export interface MediaSearchDropdownProps extends Omit<ViewProps, 'style'> {
  /**
   * List of search results to display
   */
  results: MediaSearchResult[];

  /**
   * Callback when a result is selected
   */
  onSelectResult: (result: MediaSearchResult) => void;

  /**
   * Type of media being searched (for icons and labels)
   */
  mediaType: MediaType;

  /**
   * Whether the dropdown is visible
   */
  visible: boolean;

  /**
   * Whether a search is currently in progress
   */
  isLoading?: boolean;

  /**
   * The search query (for "Create manual" option)
   */
  searchQuery?: string;

  /**
   * Callback when manual entry is requested
   */
  onManualEntry?: (title: string) => void;

  /**
   * Whether to show manual entry option
   * @default true
   */
  showManualOption?: boolean;

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Maximum number of results to show
   * @default 5
   */
  maxResults?: number;

  /**
   * Error message to display (e.g., network error)
   */
  errorMessage?: string;
}
