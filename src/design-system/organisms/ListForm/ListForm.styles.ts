/**
 * ListForm Organism Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createListFormStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
    },
    section: {
      gap: theme.spacing.sm,
    },
    label: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.mutedForeground,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    input: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.foreground,
      backgroundColor: theme.colors.input,
      borderRadius: theme.radii.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    inputFocused: {
      borderColor: theme.colors.primary,
    },
    inputError: {
      borderColor: theme.colors.destructive,
    },
    errorText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.destructive,
      marginTop: theme.spacing.xs,
    },
    footer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPrimary: {
      backgroundColor: theme.colors.primary,
    },
    buttonSecondary: {
      backgroundColor: theme.colors.muted,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.semibold,
    },
    buttonTextPrimary: {
      color: theme.colors.primaryForeground,
    },
    buttonTextSecondary: {
      color: theme.colors.foreground,
    },
  });
};
