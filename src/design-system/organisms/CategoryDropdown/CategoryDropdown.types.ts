/**
 * CategoryDropdown Organism Types
 *
 * Expandable dropdown for grouping lists by category (Shopping, Movies, Books, Games).
 */

import type { ViewProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import type { List, ListType } from '@domain/list';

export interface CategoryDropdownProps extends Omit<ViewProps, 'style'> {
  /**
   * The list type/category this dropdown represents
   */
  category: ListType;

  /**
   * Lists belonging to this category
   */
  lists: List[];

  /**
   * Item counts per list (keyed by list ID)
   */
  itemCounts?: Record<string, number>;

  /**
   * Whether the dropdown is expanded
   * @default true
   */
  expanded?: boolean;

  /**
   * Callback when the header is pressed to toggle expansion
   */
  onToggleExpand?: () => void;

  /**
   * Callback when a list card is pressed
   */
  onListPress?: (list: List) => void;

  /**
   * Callback when a list card is long pressed
   */
  onListLongPress?: (list: List) => void;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Category display information
 */
export interface CategoryInfo {
  icon: LucideIcon;
  labelKey: string;
  colorKey: string;
}

export type CategoryInfoMap = Record<ListType, CategoryInfo>;
