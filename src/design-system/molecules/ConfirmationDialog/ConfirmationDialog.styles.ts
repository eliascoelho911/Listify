/**
 * ConfirmationDialog Molecule Styles
 *
 * Dialog de confirmação para ações destrutivas. Inspirado no AlertDialog do Shadcn.
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createConfirmationDialogStyles = (theme: Theme) => {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.lg,
      padding: theme.spacing.xl,
      width: '100%',
      maxWidth: 340,
      shadowColor: theme.colors.shadowBase,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    title: {
      fontSize: theme.typography.sizes.lg,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.foreground,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    description: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
      lineHeight: theme.typography.sizes.sm * 1.5,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.muted,
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    destructiveButton: {
      backgroundColor: theme.colors.destructive,
    },
    buttonPressed: {
      opacity: 0.8,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonLabel: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.medium,
    },
    cancelButtonLabel: {
      color: theme.colors.foreground,
    },
    confirmButtonLabel: {
      color: theme.colors.primaryForeground,
    },
    destructiveButtonLabel: {
      color: theme.colors.destructiveForeground,
    },
  });
};
