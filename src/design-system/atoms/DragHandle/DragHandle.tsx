/**
 * DragHandle Atom Component
 *
 * A visual drag handle indicator with a 2x3 dot grid pattern.
 * Used for drag-and-drop reordering of items.
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { createDragHandleStyles } from './DragHandle.styles';
import type { DragHandleProps } from './DragHandle.types';

export function DragHandle({
  size = 'md',
  isDragging = false,
  disabled = false,
  style,
  ...viewProps
}: DragHandleProps): ReactElement {
  const { theme } = useTheme();
  const styles = createDragHandleStyles(theme, size, isDragging, disabled);

  return (
    <View style={[styles.container, style]} {...viewProps}>
      <View style={styles.dotsContainer}>
        <View style={styles.column}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <View style={styles.column}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
}
