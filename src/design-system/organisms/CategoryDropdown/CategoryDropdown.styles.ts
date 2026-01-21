/**
 * CategoryDropdown Organism Styles
 *
 * Styles for the expandable category dropdown with lists inside.
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createCategoryDropdownStyles = (theme: Theme, expanded: boolean) => {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    headerPressed: {
      opacity: 0.8,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    categoryLabel: {
      fontSize: theme.typography.sizes.md,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.foreground,
    },
    countBadge: {
      marginLeft: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.muted,
    },
    countText: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.mutedForeground,
    },
    chevron: {
      transform: [{ rotate: expanded ? '0deg' : '-90deg' }],
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
      overflow: 'hidden',
    },
    listCardWrapper: {
      marginBottom: theme.spacing.sm,
    },
    emptyText: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.regular,
      color: theme.colors.mutedForeground,
      textAlign: 'center',
      paddingVertical: theme.spacing.lg,
    },
  });
};

export type CategoryDropdownStyles = ReturnType<typeof createCategoryDropdownStyles>;
