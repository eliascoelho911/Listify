/**
 * ListCard Molecule Styles
 *
 * Styles for the list card component with selection state support.
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createListCardStyles = (theme: Theme, selected: boolean) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.card,
      borderWidth: selected ? 2 : 1,
      borderColor: selected ? theme.colors.primary : theme.colors.border,
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    name: {
      flex: 1,
      fontSize: theme.typography.sizes.base,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.foreground,
    },
    itemCount: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.mutedForeground,
      marginLeft: theme.spacing.sm,
    },
    description: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.regular,
      color: theme.colors.mutedForeground,
      marginTop: theme.spacing.xs,
    },
    prefabBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
      gap: theme.spacing.xs,
    },
    prefabBadgeText: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.mutedForeground,
    },
  });
};

export type ListCardStyles = ReturnType<typeof createListCardStyles>;
