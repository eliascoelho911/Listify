/**
 * SmartInputModal Organism Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createSmartInputModalStyles = (theme: Theme) => {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.overlayLight,
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: theme.radii.xl,
      borderTopRightRadius: theme.radii.xl,
      paddingTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      maxHeight: '80%',
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: theme.colors.muted,
      borderRadius: theme.radii.full,
      alignSelf: 'center',
      marginBottom: theme.spacing.md,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.input,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    inputFocused: {
      borderColor: theme.colors.ring,
    },
    input: {
      flex: 1,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.base,
      color: theme.colors.foreground,
      paddingVertical: theme.spacing.xs,
      minHeight: 40,
    },
    submitButton: {
      width: 36,
      height: 36,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.muted,
    },
    previewContainer: {
      marginTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
    },
    highlightContainer: {
      marginTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
    },
    suggestionsContainer: {
      position: 'absolute',
      left: theme.spacing.md,
      right: theme.spacing.md,
      bottom: '100%',
      marginBottom: theme.spacing.sm,
    },
    hidden: {
      display: 'none',
    },
  });
};

export type SmartInputModalStyles = ReturnType<typeof createSmartInputModalStyles>;
