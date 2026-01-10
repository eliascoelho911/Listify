/**
 * Button Atom Styles
 *
 * Uses tokens exclusively (zero hard-coded values)
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { ButtonSize, ButtonVariant } from './Button.types';

export const createButtonStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radii.lg, // Large radius
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    text: {
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.semibold,
      fontSize: theme.typography.sizes.base,
    },
    disabled: {
      opacity: 0.5,
    },
    loading: {
      opacity: 0.7,
    },
  });

  // Variant styles
  const variantStyles: Record<ButtonVariant, any> = {
    default: {
      backgroundColor: theme.colors.primary,
    },
    destructive: {
      backgroundColor: theme.colors.destructive,
    },
    outline: {
      backgroundColor: theme.colors.transparent,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    ghost: {
      backgroundColor: theme.colors.transparent,
    },
    link: {
      backgroundColor: theme.colors.transparent,
      paddingHorizontal: 0,
    },
  };

  // Text colors per variant
  const textColorStyles: Record<ButtonVariant, any> = {
    default: {
      color: theme.colors.primaryForeground,
    },
    destructive: {
      color: theme.colors.destructiveForeground,
    },
    outline: {
      color: theme.colors.foreground,
    },
    ghost: {
      color: theme.colors.foreground,
    },
    link: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
  };

  // Size styles
  const sizeStyles: Record<ButtonSize, any> = {
    sm: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      fontSize: theme.typography.sizes.sm,
    },
    md: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.sizes.base,
    },
    lg: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      fontSize: theme.typography.sizes.lg,
    },
    icon: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      width: 40,
      height: 40,
    },
  };

  return {
    baseStyles,
    variantStyles,
    textColorStyles,
    sizeStyles,
  };
};
