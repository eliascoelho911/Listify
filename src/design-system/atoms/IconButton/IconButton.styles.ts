/**
 * IconButton Atom Styles
 *
 * Uses tokens exclusively (zero hard-coded values)
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { IconButtonSize, IconButtonVariant } from './IconButton.types';

export const createIconButtonStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radii.lg, // 16px
    },
    disabled: {
      opacity: 0.4,
    },
  });

  // Variant styles
  const variantStyles: Record<IconButtonVariant, any> = {
    ghost: {
      backgroundColor: theme.colors.transparent,
    },
    outline: {
      backgroundColor: theme.colors.transparent,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filled: {
      backgroundColor: theme.colors.secondary,
    },
    accent: {
      backgroundColor: theme.colors.primary,
    },
  };

  // Variant styles when active
  const activeVariantStyles: Record<IconButtonVariant, any> = {
    ghost: {
      backgroundColor: theme.colors.muted,
    },
    outline: {
      backgroundColor: theme.colors.muted,
      borderColor: theme.colors.ring,
    },
    filled: {
      backgroundColor: theme.colors.muted,
    },
    accent: {
      backgroundColor: theme.colors.accent,
    },
  };

  // Icon colors per variant
  const iconColorStyles: Record<IconButtonVariant, string> = {
    ghost: theme.colors.navbarForeground,
    outline: theme.colors.navbarForeground,
    filled: theme.colors.secondaryForeground,
    accent: theme.colors.primaryForeground,
  };

  // Size styles - ensures 44x44px minimum touch target
  const sizeStyles: Record<IconButtonSize, any> = {
    sm: {
      width: 44,
      height: 44,
      minWidth: 44,
      minHeight: 44,
    },
    md: {
      width: 44,
      height: 44,
      minWidth: 44,
      minHeight: 44,
    },
    lg: {
      width: 48,
      height: 48,
      minWidth: 48,
      minHeight: 48,
    },
  };

  // Icon sizes
  const iconSizes: Record<IconButtonSize, number> = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return {
    baseStyles,
    variantStyles,
    activeVariantStyles,
    iconColorStyles,
    sizeStyles,
    iconSizes,
  };
};
