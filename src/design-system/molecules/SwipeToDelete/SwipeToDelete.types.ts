/**
 * SwipeToDelete Molecule Types
 *
 * Swipeable container that reveals delete action when swiped left.
 */

import type { ReactElement } from 'react';
import type { ViewProps } from 'react-native';

export interface SwipeToDeleteProps extends Omit<ViewProps, 'children'> {
  /**
   * The content to render inside the swipeable area
   */
  children: ReactElement;

  /**
   * Callback when delete action is triggered
   */
  onDelete: () => void;

  /**
   * Whether swipe is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * The swipe threshold percentage (0-1) to trigger delete
   * @default 0.3
   */
  threshold?: number;

  /**
   * Whether to show delete confirmation before executing
   * @default false
   */
  requireConfirmation?: boolean;

  /**
   * Label for the delete action
   * @default 'Delete'
   */
  deleteLabel?: string;

  /**
   * Test ID for testing
   */
  testID?: string;
}
