/**
 * GroupHeader Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { GroupHeaderVariant } from './GroupHeader.types';

export const createGroupHeaderStyles = (theme: Theme, variant: GroupHeaderVariant) => {
  const variantStyles = {
    date: {
      container: {
        backgroundColor: theme.colors.background,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
      },
      label: {
        color: theme.colors.mutedForeground,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium as '500',
        textTransform: 'uppercase' as const,
        letterSpacing: 0.5,
      },
    },
    list: {
      container: {
        backgroundColor: theme.colors.muted,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radii.sm,
      },
      label: {
        color: theme.colors.foreground,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.semibold as '600',
      },
    },
    category: {
      container: {
        backgroundColor: theme.colors.transparent,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      },
      label: {
        color: theme.colors.primary,
        fontSize: theme.typography.sizes.xs,
        fontWeight: theme.typography.weights.bold as '700',
        textTransform: 'uppercase' as const,
        letterSpacing: 1,
      },
    },
  };

  const currentVariant = variantStyles[variant];

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...currentVariant.container,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    label: {
      fontFamily: theme.typography.families.body,
      ...currentVariant.label,
    },
    count: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.medium as '500',
      color: theme.colors.mutedForeground,
    },
    pressable: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
  });
};
