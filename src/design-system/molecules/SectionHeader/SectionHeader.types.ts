/**
 * SectionHeader Molecule Types
 *
 * Header component for sections within lists. Displays section name with
 * expand/collapse toggle and actions menu.
 */

import type { ViewProps } from 'react-native';

export interface SectionHeaderProps extends Omit<ViewProps, 'style'> {
  /**
   * Section name to display
   */
  name: string;

  /**
   * Number of items in the section
   */
  itemCount?: number;

  /**
   * Whether the section is expanded
   * @default true
   */
  expanded?: boolean;

  /**
   * Callback when expand/collapse is toggled
   */
  onToggleExpand?: () => void;

  /**
   * Callback when the section is long pressed (for context menu)
   */
  onLongPress?: () => void;

  /**
   * Callback when the add item button is pressed
   */
  onAddItem?: () => void;

  /**
   * Whether to show the add item button
   * @default false
   */
  showAddButton?: boolean;

  /**
   * Whether the section is currently being dragged
   * @default false
   */
  isDragging?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;
}
