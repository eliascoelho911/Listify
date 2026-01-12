/**
 * DateBadge Atom Styles
 *
 * Badge de data para separadores em listas (sticky headers).
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { DateBadgeVariant } from './DateBadge.types';

export const createDateBadgeStyles = (theme: Theme, variant: DateBadgeVariant) => {
  const variantStyles = {
    today: {
      backgroundColor: theme.colors.primary,
      textColor: theme.colors.primaryForeground,
    },
    yesterday: {
      backgroundColor: theme.colors.accent,
      textColor: theme.colors.accentForeground,
    },
    default: {
      backgroundColor: theme.colors.muted,
      textColor: theme.colors.mutedForeground,
    },
  };

  const { backgroundColor, textColor } = variantStyles[variant];

  return StyleSheet.create({
    container: {
      alignSelf: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radii.full,
      backgroundColor,
    },
    label: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.medium as '500',
      color: textColor,
      textAlign: 'center',
    },
  });
};
