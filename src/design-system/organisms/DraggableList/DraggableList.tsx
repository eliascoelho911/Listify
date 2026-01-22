/**
 * DraggableList Organism Component
 *
 * A wrapper around react-native-draggable-flatlist that provides
 * drag-and-drop reordering functionality with proper theming.
 */

import React, { type ReactElement, useCallback } from 'react';
import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useTheme } from '../../theme';
import { createDraggableListStyles } from './DraggableList.styles';
import type {
  DraggableListItem,
  DraggableListProps,
  DraggableListRenderItemParams,
} from './DraggableList.types';

export function DraggableList<T extends DraggableListItem>({
  data,
  renderItem,
  onDragEnd,
  keyExtractor,
  isReorderEnabled = true,
  style,
  contentContainerStyle,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  autoscrollEnabled = true,
  autoscrollSpeed = 100,
  autoscrollThreshold = 30,
}: DraggableListProps<T>): ReactElement {
  const { theme } = useTheme();
  const styles = createDraggableListStyles(theme);

  const defaultKeyExtractor = useCallback((item: T) => item.id, []);

  const handleRenderItem = useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<T>) => {
      const params: DraggableListRenderItemParams<T> = {
        item,
        drag: isReorderEnabled ? drag : () => {},
        isActive,
        getIndex,
      };

      return <ScaleDecorator>{renderItem(params)}</ScaleDecorator>;
    },
    [renderItem, isReorderEnabled],
  );

  const handleDragEnd = useCallback(
    ({ data: reorderedData }: { data: T[] }) => {
      // Update sortOrder based on new positions
      const updatedData = reorderedData.map((item, index) => ({
        ...item,
        sortOrder: index,
      }));
      onDragEnd(updatedData);
    },
    [onDragEnd],
  );

  return (
    <GestureHandlerRootView style={[styles.container, style]}>
      <DraggableFlatList
        data={data}
        renderItem={handleRenderItem}
        keyExtractor={keyExtractor ?? defaultKeyExtractor}
        onDragEnd={handleDragEnd}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        autoscrollSpeed={autoscrollSpeed}
        autoscrollThreshold={autoscrollThreshold}
        activationDistance={isReorderEnabled ? 0 : 999999}
      />
    </GestureHandlerRootView>
  );
}
