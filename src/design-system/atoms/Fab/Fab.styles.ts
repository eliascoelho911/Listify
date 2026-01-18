/**
 * Fab Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createFabStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.lg,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8,
      shadowColor: theme.colors.foreground,
      shadowOffset: {
        width: 0,
        height: theme.spacing.xs,
      },
      shadowOpacity: 0.3,
      shadowRadius: theme.spacing.sm,
    },
    small: {
      width: 72,
      height: 56,
    },
    medium: {
      width: 96,
      height: 56,
    },
    disabled: {
      backgroundColor: theme.colors.muted,
      opacity: 0.5,
    },
  });
};
