/**
 * BottombarNotch Component
 *
 * SVG component that renders the curved notch background for the BottomBar
 * The notch creates a visual cutout effect where the FAB appears to "burst through" the bar
 */

import React, { type ReactElement, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '../../theme';
import type { BottombarNotchProps } from './BottombarNotch.types';

/**
 * Calculate the SVG path for the notch shape
 * Creates a pill-shaped bar with a curved cutout in the center for the FAB
 */
function calculateNotchPath(
  containerWidth: number,
  containerHeight: number,
  fabSize: number,
  notchPadding: number,
): string {
  const centerX = containerWidth / 2;
  const notchWidth = fabSize + notchPadding * 2;
  const notchDepth = fabSize * 0.5;

  const notchStartX = centerX - notchWidth / 2;
  const notchEndX = centerX + notchWidth / 2;

  // Control point offset for smooth bezier curves
  const curveControlOffset = notchWidth * 0.2;

  // Border radius for the pill shape
  const borderRadius = containerHeight / 2;

  // SVG path with pill shape and smooth notch cutout
  // Starting from top-left, going clockwise
  return `
    M ${borderRadius},0
    L ${notchStartX},0
    C ${notchStartX + curveControlOffset},0 ${notchStartX + curveControlOffset},${notchDepth} ${centerX},${notchDepth}
    C ${notchEndX - curveControlOffset},${notchDepth} ${notchEndX - curveControlOffset},0 ${notchEndX},0
    L ${containerWidth - borderRadius},0
    Q ${containerWidth},0 ${containerWidth},${borderRadius}
    L ${containerWidth},${containerHeight - borderRadius}
    Q ${containerWidth},${containerHeight} ${containerWidth - borderRadius},${containerHeight}
    L ${borderRadius},${containerHeight}
    Q 0,${containerHeight} 0,${containerHeight - borderRadius}
    L 0,${borderRadius}
    Q 0,0 ${borderRadius},0
    Z
  `;
}

export function BottombarNotch({
  width,
  height,
  fabSize,
}: BottombarNotchProps): ReactElement | null {
  const { theme } = useTheme();

  const notchPath = useMemo(() => {
    if (width <= 0 || height <= 0) return '';
    return calculateNotchPath(width, height, fabSize, theme.spacing.md);
  }, [width, height, fabSize, theme.spacing.md]);

  if (width <= 0 || height <= 0) {
    return null;
  }

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Fill */}
      <Path d={notchPath} fill={theme.colors.bottombar} />
      {/* Border stroke */}
      <Path d={notchPath} fill="none" stroke={theme.colors.bottombarBorder} strokeWidth={1} />
    </Svg>
  );
}
