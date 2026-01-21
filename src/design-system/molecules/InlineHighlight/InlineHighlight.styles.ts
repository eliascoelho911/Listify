/**
 * InlineHighlight Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createInlineHighlightStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    baseText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.base,
      color: theme.colors.foreground,
    },
    highlightList: {
      backgroundColor: theme.colors.primary + '30',
      color: theme.colors.primary,
      borderRadius: theme.radii.sm,
      paddingHorizontal: theme.spacing.xs,
    },
    highlightSection: {
      backgroundColor: theme.colors.secondary + '30',
      color: theme.colors.secondary,
      borderRadius: theme.radii.sm,
      paddingHorizontal: theme.spacing.xs,
    },
    highlightPrice: {
      backgroundColor: theme.colors.accent + '30',
      color: theme.colors.accent,
      borderRadius: theme.radii.sm,
      paddingHorizontal: theme.spacing.xs,
      fontFamily: theme.typography.families.mono,
    },
    highlightQuantity: {
      backgroundColor: theme.colors.muted + '50',
      color: theme.colors.mutedForeground,
      borderRadius: theme.radii.sm,
      paddingHorizontal: theme.spacing.xs,
      fontFamily: theme.typography.families.mono,
    },
  });
};

export type InlineHighlightStyles = ReturnType<typeof createInlineHighlightStyles>;
