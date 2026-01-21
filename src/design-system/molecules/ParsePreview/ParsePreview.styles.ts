/**
 * ParsePreview Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createParsePreviewStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radii.md,
      gap: theme.spacing.xs,
    },
    chipList: {
      backgroundColor: theme.colors.primary + '20',
    },
    chipSection: {
      backgroundColor: theme.colors.secondary + '20',
    },
    chipPrice: {
      backgroundColor: theme.colors.accent + '20',
    },
    chipQuantity: {
      backgroundColor: theme.colors.muted,
    },
    label: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.mutedForeground,
      textTransform: 'uppercase',
    },
    valueList: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.medium,
    },
    valueSection: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.secondary,
      fontWeight: theme.typography.weights.medium,
    },
    valuePrice: {
      fontFamily: theme.typography.families.mono,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.accent,
      fontWeight: theme.typography.weights.semibold,
    },
    valueQuantity: {
      fontFamily: theme.typography.families.mono,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
      fontWeight: theme.typography.weights.medium,
    },
  });
};

export type ParsePreviewStyles = ReturnType<typeof createParsePreviewStyles>;
