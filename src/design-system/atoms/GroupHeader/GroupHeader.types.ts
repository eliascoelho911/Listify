/**
 * GroupHeader Atom Types
 *
 * Header for grouping items in lists (Inbox, Notes, etc.).
 * Used as sticky headers for date groups or list/category groups.
 */

import type { ViewProps } from 'react-native';

export type GroupHeaderVariant = 'date' | 'list' | 'category';

export interface GroupHeaderProps extends Omit<ViewProps, 'style'> {
  /**
   * Group label text (e.g., "Today", "Shopping List", "Notes")
   */
  label: string;

  /**
   * Optional item count to show next to label
   */
  count?: number;

  /**
   * Visual variant of the header
   * @default 'date'
   */
  variant?: GroupHeaderVariant;

  /**
   * Whether the group is collapsible
   * @default false
   */
  collapsible?: boolean;

  /**
   * Whether the group is currently collapsed (only relevant if collapsible)
   */
  collapsed?: boolean;

  /**
   * Callback when collapse toggle is pressed
   */
  onToggleCollapse?: () => void;
}
