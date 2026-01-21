/**
 * InfiniteScrollList Organism Types
 *
 * Generic virtualized list with infinite scroll support.
 * Used for Inbox, Notes, Lists screens with grouped items.
 */

import type { ReactElement } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface InfiniteScrollGroup<T> {
  /**
   * Unique key for the group
   */
  key: string;

  /**
   * Group title
   */
  title: string;

  /**
   * Items in this group
   */
  items: T[];
}

export interface InfiniteScrollListProps<T> {
  /**
   * Grouped data to render
   */
  groups: InfiniteScrollGroup<T>[];

  /**
   * Render function for each item
   */
  renderItem: (item: T, index: number) => ReactElement;

  /**
   * Render function for group headers
   */
  renderGroupHeader?: (group: InfiniteScrollGroup<T>) => ReactElement;

  /**
   * Function to extract unique key from item
   */
  keyExtractor: (item: T) => string;

  /**
   * Whether more data is being loaded
   */
  isLoading?: boolean;

  /**
   * Whether there's more data to load
   */
  hasMore?: boolean;

  /**
   * Callback when end of list is reached
   */
  onEndReached?: () => void;

  /**
   * Threshold for triggering onEndReached (0 to 1)
   * @default 0.5
   */
  onEndReachedThreshold?: number;

  /**
   * Callback for pull-to-refresh
   */
  onRefresh?: () => void;

  /**
   * Whether currently refreshing
   */
  refreshing?: boolean;

  /**
   * Content to show when list is empty
   */
  emptyContent?: ReactElement;

  /**
   * Content to show at bottom while loading more
   */
  loadingFooter?: ReactElement;

  /**
   * Custom style for the list container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom style for list content
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Whether to show sticky group headers
   * @default true
   */
  stickyHeaders?: boolean;

  /**
   * Gap between items
   * @default 8
   */
  itemGap?: number;

  /**
   * Gap between groups
   * @default 16
   */
  groupGap?: number;
}
