/**
 * Icon Atom Component
 *
 * Wrapper for Lucide React Native icons
 * Uses theme tokens for sizing
 */

import React, { type ReactElement } from 'react';

import { useTheme } from '../../theme';
import type { IconProps } from './Icon.types';

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export function Icon({
  icon: IconComponent,
  size = 'md',
  color,
  iconProps,
}: IconProps): ReactElement {
  const { theme } = useTheme();

  const iconSize = sizeMap[size];
  const iconColor = color || theme.colors.foreground;

  return <IconComponent size={iconSize} color={iconColor} {...iconProps} />;
}
