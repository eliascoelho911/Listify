/**
 * DragHandle Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { DragHandleSize } from './DragHandle.types';

const SIZES: Record<DragHandleSize, { containerSize: number; dotSize: number; gap: number }> = {
  sm: { containerSize: 20, dotSize: 3, gap: 2 },
  md: { containerSize: 24, dotSize: 4, gap: 3 },
  lg: { containerSize: 32, dotSize: 5, gap: 4 },
};

export const createDragHandleStyles = (
  theme: Theme,
  size: DragHandleSize,
  isDragging: boolean,
  disabled: boolean,
) => {
  const sizeConfig = SIZES[size];

  return StyleSheet.create({
    container: {
      width: sizeConfig.containerSize,
      height: sizeConfig.containerSize,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disabled ? 0.3 : isDragging ? 1 : 0.6,
    },
    dotsContainer: {
      flexDirection: 'row',
      gap: sizeConfig.gap,
    },
    column: {
      gap: sizeConfig.gap,
    },
    dot: {
      width: sizeConfig.dotSize,
      height: sizeConfig.dotSize,
      borderRadius: sizeConfig.dotSize / 2,
      backgroundColor: isDragging ? theme.colors.primary : theme.colors.mutedForeground,
    },
  });
};
