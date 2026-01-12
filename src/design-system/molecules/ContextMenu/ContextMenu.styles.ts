/**
 * ContextMenu Molecule Styles
 *
 * Menu de opções contextual (long press). Inspirado no DropdownMenu do Shadcn.
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createContextMenuStyles = (theme: Theme) => {
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.overlayLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.lg,
      minWidth: 200,
      maxWidth: 280,
      padding: theme.spacing.xs,
      shadowColor: theme.colors.shadowBase,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    title: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.semibold as '600',
      color: theme.colors.foreground,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: theme.spacing.xs,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.md,
      gap: theme.spacing.sm,
    },
    itemPressed: {
      backgroundColor: theme.colors.accent,
    },
    itemDisabled: {
      opacity: 0.5,
    },
    itemLabel: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.foreground,
      flex: 1,
    },
    itemLabelDestructive: {
      color: theme.colors.destructive,
    },
  });
};
