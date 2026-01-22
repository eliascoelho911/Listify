/**
 * DraggableList Organism Types
 */

import type { ReactElement } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { DragEndParams, RenderItemParams } from 'react-native-draggable-flatlist';

export interface DraggableListItem {
  id: string;
  sortOrder: number;
}

export interface DraggableListProps<T extends DraggableListItem> {
  /**
   * Array of items to render in the list
   */
  data: T[];
  /**
   * Render function for each item
   * Receives item, drag function, isActive state, and getIndex function
   */
  renderItem: (params: DraggableListRenderItemParams<T>) => ReactElement;
  /**
   * Callback when drag ends with reordered data
   */
  onDragEnd: (data: T[]) => void;
  /**
   * Key extractor function (defaults to item.id)
   */
  keyExtractor?: (item: T, index: number) => string;
  /**
   * Whether the list is in edit/reorder mode
   * @default true
   */
  isReorderEnabled?: boolean;
  /**
   * Style for the list container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the content container
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Component to render when list is empty
   */
  ListEmptyComponent?: ReactElement | null;
  /**
   * Component to render at the top of the list
   */
  ListHeaderComponent?: ReactElement | null;
  /**
   * Component to render at the bottom of the list
   */
  ListFooterComponent?: ReactElement | null;
  /**
   * Enable autoscroll when dragging near edges
   * @default true
   */
  autoscrollEnabled?: boolean;
  /**
   * Speed of autoscroll
   * @default 100
   */
  autoscrollSpeed?: number;
  /**
   * Threshold from edge to trigger autoscroll
   * @default 30
   */
  autoscrollThreshold?: number;
}

export interface DraggableListRenderItemParams<T extends DraggableListItem> {
  /**
   * The item data
   */
  item: T;
  /**
   * Function to call to initiate drag
   */
  drag: () => void;
  /**
   * Whether this item is currently being dragged
   */
  isActive: boolean;
  /**
   * Function to get the current index of the item
   */
  getIndex: () => number | undefined;
}

export type { DragEndParams, RenderItemParams };
