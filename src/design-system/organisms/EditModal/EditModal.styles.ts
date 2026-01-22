/**
 * EditModal Organism Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createEditModalStyles = (theme: Theme) => {
  return StyleSheet.create({
    hidden: {
      display: 'none',
    },
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: theme.colors.overlayLight,
    },
    container: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: theme.radii.xl,
      borderTopRightRadius: theme.radii.xl,
      paddingTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },
    handle: {
      width: 36,
      height: 4,
      backgroundColor: theme.colors.muted,
      borderRadius: theme.radii.full,
      alignSelf: 'center',
      marginBottom: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.foreground,
      fontFamily: theme.typography.families.body,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.input,
      borderRadius: theme.radii.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.sm,
    },
    inputFocused: {
      borderColor: theme.colors.ring,
    },
    input: {
      flex: 1,
      fontSize: theme.typography.sizes.base,
      color: theme.colors.foreground,
      fontFamily: theme.typography.families.body,
      paddingVertical: theme.spacing.xs,
      minHeight: 40,
    },
    submitButton: {
      width: 36,
      height: 36,
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing.sm,
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.muted,
      opacity: 0.5,
    },
    highlightContainer: {
      marginBottom: theme.spacing.sm,
    },
    previewContainer: {
      marginBottom: theme.spacing.md,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    deleteButtonText: {
      color: theme.colors.destructive,
      marginLeft: theme.spacing.xs,
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
    },
    buttonsRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
  });
};
