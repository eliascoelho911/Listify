/**
 * PriceBadge Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export type PriceBadgeSize = 'sm' | 'md' | 'lg';

const PADDING: Record<PriceBadgeSize, { horizontal: number; vertical: number }> = {
  sm: { horizontal: 6, vertical: 2 },
  md: { horizontal: 8, vertical: 4 },
  lg: { horizontal: 12, vertical: 6 },
};

export const getFontSize = (size: PriceBadgeSize, theme: Theme): number => {
  const sizeMap: Record<PriceBadgeSize, number> = {
    sm: theme.typography.sizes.xs,
    md: theme.typography.sizes.sm,
    lg: theme.typography.sizes.lg,
  };
  return sizeMap[size];
};

export const createPriceBadgeStyles = (
  theme: Theme,
  options: { size: PriceBadgeSize; showBackground: boolean },
) => {
  const { size, showBackground } = options;
  const padding = PADDING[size];

  return StyleSheet.create({
    container: {
      paddingHorizontal: showBackground ? padding.horizontal : 0,
      paddingVertical: showBackground ? padding.vertical : 0,
      borderRadius: theme.radii.sm,
      backgroundColor: showBackground ? theme.colors.accent : theme.colors.transparent,
    },
    text: {
      fontFamily: theme.typography.families.mono,
      fontSize: getFontSize(size, theme),
      fontWeight: theme.typography.weights.semibold as '600',
      color: theme.colors.primary,
    },
  });
};
