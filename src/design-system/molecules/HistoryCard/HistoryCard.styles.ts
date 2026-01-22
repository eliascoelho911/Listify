/**
 * HistoryCard Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createHistoryCardStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    leftContent: {
      flexDirection: 'column',
      gap: theme.spacing.xs,
    },
    dateText: {
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.foreground,
      fontFamily: theme.typography.families.body,
    },
    itemCountText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.families.body,
    },
    rightContent: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: theme.spacing.xs,
    },
    totalText: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
      fontFamily: theme.typography.families.body,
    },
    iconContainer: {
      opacity: 0.5,
    },
  });
};
