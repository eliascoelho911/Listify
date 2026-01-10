/**
 * Badge Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { BadgeVariant } from './Badge.types';

export const createBadgeStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    badge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radii.xl, // XL radius for pill shape
      borderWidth: 1,
      borderColor: theme.colors.transparent,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.semibold,
    },
  });

  const variantStyles: Record<BadgeVariant, any> = {
    default: {
      badge: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.transparent,
      },
      text: {
        color: theme.colors['primary-foreground'],
      },
    },
    secondary: {
      badge: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.transparent,
      },
      text: {
        color: theme.colors['secondary-foreground'],
      },
    },
    destructive: {
      badge: {
        backgroundColor: theme.colors.destructive,
        borderColor: theme.colors.transparent,
      },
      text: {
        color: theme.colors['destructive-foreground'],
      },
    },
    outline: {
      badge: {
        backgroundColor: theme.colors.transparent,
        borderColor: theme.colors.border,
      },
      text: {
        color: theme.colors.foreground,
      },
    },
  };

  return { baseStyles, variantStyles };
};
