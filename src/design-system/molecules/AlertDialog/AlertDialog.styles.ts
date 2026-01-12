/**
 * AlertDialog Molecule Styles
 *
 * Diálogo de confirmação. Baseado no AlertDialog do Shadcn.
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createAlertDialogStyles = (theme: Theme) => {
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.lg,
      width: '100%',
      maxWidth: 400,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadowBase,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 12,
    },
    title: {
      fontSize: theme.typography.sizes.lg,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.semibold as '600',
      color: theme.colors.foreground,
      marginBottom: theme.spacing.sm,
    },
    description: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
      marginBottom: theme.spacing.lg,
      lineHeight: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: theme.spacing.sm,
    },
    button: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.md,
      minWidth: 80,
      alignItems: 'center',
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
    buttonText: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.medium as '500',
    },
    cancelButtonText: {
      color: theme.colors.foreground,
    },
    confirmButtonText: {
      color: theme.colors.primaryForeground,
    },
    destructiveButtonText: {
      color: theme.colors.destructiveForeground,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
  });
};
