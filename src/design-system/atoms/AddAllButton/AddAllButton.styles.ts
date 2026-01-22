/**
 * AddAllButton Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createAddAllButtonStyles = (theme: Theme, disabled: boolean) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: disabled ? theme.colors.muted : theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.lg,
      gap: theme.spacing.sm,
    },
    icon: {
      marginRight: theme.spacing.xs,
    },
    label: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.semibold as '600',
      color: disabled ? theme.colors.mutedForeground : theme.colors.primaryForeground,
    },
    badge: {
      backgroundColor: disabled
        ? theme.colors.mutedForeground
        : theme.colors.primaryForeground,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.radii.full,
      marginLeft: theme.spacing.xs,
    },
    badgeText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.bold as '700',
      color: disabled ? theme.colors.muted : theme.colors.primary,
    },
  });
};
