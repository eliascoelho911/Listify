/**
 * CompleteButton Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createCompleteButtonStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    containerDisabled: {
      backgroundColor: theme.colors.muted,
      opacity: 0.6,
    },
    content: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    label: {
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.primaryForeground,
      fontFamily: theme.typography.families.body,
    },
    details: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    detailText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primaryForeground,
      fontFamily: theme.typography.families.body,
      opacity: 0.9,
    },
    totalText: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.primaryForeground,
      fontFamily: theme.typography.families.body,
    },
    separator: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primaryForeground,
      fontFamily: theme.typography.families.body,
      opacity: 0.6,
    },
    iconContainer: {
      marginRight: theme.spacing.xs,
    },
  });
};
