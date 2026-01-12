/**
 * EmptyState Molecule Styles
 *
 * Styles for the empty state component.
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createEmptyStateStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    iconContainer: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold as '600',
      fontFamily: theme.typography.families.body,
      color: theme.colors.foreground,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
      textAlign: 'center',
    },
  });
};
