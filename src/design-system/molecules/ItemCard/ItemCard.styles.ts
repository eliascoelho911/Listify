/**
 * ItemCard Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createItemCardStyles = (theme: Theme, selected?: boolean) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: theme.spacing.md,
      borderRadius: theme.radii.lg,
      backgroundColor: selected ? theme.colors.accent : theme.colors.card,
      borderWidth: 1,
      borderColor: selected ? theme.colors.primary : theme.colors.border,
      gap: theme.spacing.sm,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.medium as '500',
      color: theme.colors.foreground,
      flex: 1,
    },
    checkedTitle: {
      textDecorationLine: 'line-through',
      color: theme.colors.mutedForeground,
    },
    subtitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    listBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.muted,
    },
    listBadgeText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.mutedForeground,
    },
    price: {
      fontFamily: theme.typography.families.mono,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold as '600',
      color: theme.colors.primary,
    },
    quantity: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
    },
    timestamp: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.mutedForeground,
    },
  });
};
