/**
 * Input Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { InputState } from './Input.types';

export const createInputStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: theme.colors.input,
      borderRadius: theme.radii.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.base,
      color: theme.colors.foreground,
      backgroundColor: theme.colors.background,
    },
    helperText: {
      marginTop: theme.spacing.xs,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
    },
    errorText: {
      marginTop: theme.spacing.xs,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.destructive,
    },
  });

  const stateStyles: Record<InputState, any> = {
    default: {
      borderColor: theme.colors.input,
    },
    focus: {
      borderColor: theme.colors.ring,
      borderWidth: 2,
    },
    error: {
      borderColor: theme.colors.destructive,
    },
    disabled: {
      opacity: 0.5,
      backgroundColor: theme.colors.muted,
    },
  };

  return { baseStyles, stateStyles };
};
