/**
 * DragHandle Atom Types
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

export type DragHandleSize = 'sm' | 'md' | 'lg';

export interface DragHandleProps extends Omit<ViewProps, 'style'> {
  /**
   * Size of the drag handle
   * @default 'md'
   */
  size?: DragHandleSize;
  /**
   * Whether the drag handle is currently being dragged
   */
  isDragging?: boolean;
  /**
   * Whether the drag handle is disabled
   */
  disabled?: boolean;
  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;
}
