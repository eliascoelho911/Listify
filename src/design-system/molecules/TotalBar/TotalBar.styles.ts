/**
 * TotalBar Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createTotalBarStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    leftSection: {
      flexDirection: 'column',
      gap: theme.spacing.xs,
    },
    rightSection: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: theme.spacing.xs,
    },
    totalLabel: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
    },
    totalValue: {
      fontFamily: theme.typography.families.mono,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold as '700',
      color: theme.colors.primary,
    },
    progressText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
    },
    warningText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.mutedForeground,
      fontStyle: 'italic',
    },
  });
};
