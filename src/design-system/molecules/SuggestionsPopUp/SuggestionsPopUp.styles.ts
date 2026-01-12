/**
 * SuggestionsPopUp Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createSuggestionsPopUpStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: '100%',
      left: 0,
      right: 0,
      marginBottom: theme.spacing.xs,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.foreground,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      maxHeight: 200,
      overflow: 'hidden',
    },
    listContent: {
      padding: theme.spacing.xs,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.md,
    },
    itemPressed: {
      backgroundColor: theme.colors.accent,
    },
    itemLabel: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.foreground,
    },
    itemDescription: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
      marginLeft: theme.spacing.sm,
    },
    emptyContainer: {
      padding: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
    },
    loadingContainer: {
      padding: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
