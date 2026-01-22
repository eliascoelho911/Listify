/**
 * MediaSearchDropdown Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createMediaSearchDropdownStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.popover,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadowBase,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      overflow: 'hidden',
      maxHeight: 300,
    },
    hidden: {
      display: 'none',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    itemPressed: {
      backgroundColor: theme.colors.muted,
    },
    itemImage: {
      width: 48,
      height: 64,
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.muted,
    },
    itemImagePlaceholder: {
      width: 48,
      height: 64,
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemContent: {
      flex: 1,
      gap: theme.spacing.xs / 2,
    },
    itemTitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.popoverForeground,
      fontWeight: theme.typography.weights.medium,
    },
    itemYear: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.mutedForeground,
    },
    itemDescription: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.mutedForeground,
      lineHeight: theme.typography.sizes.xs * 1.4,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.md,
    },
    manualItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    manualItemIcon: {
      width: 48,
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
    },
    manualItemText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.medium,
    },
    manualItemTitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.popoverForeground,
      fontWeight: theme.typography.weights.semibold,
    },
    emptyText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
      textAlign: 'center',
      padding: theme.spacing.md,
    },
    errorText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.destructive,
      textAlign: 'center',
      padding: theme.spacing.md,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    loadingText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
    },
  });
};

export type MediaSearchDropdownStyles = ReturnType<typeof createMediaSearchDropdownStyles>;
