/**
 * MiniCategorySelector Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createMiniCategorySelectorStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.muted,
      gap: theme.spacing.xs,
    },
    optionSelected: {
      backgroundColor: theme.colors.primary,
    },
    optionInferred: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    label: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
    },
    labelSelected: {
      color: theme.colors.primaryForeground,
      fontWeight: theme.typography.weights.medium,
    },
    labelInferred: {
      color: theme.colors.primary,
    },
    iconWrapper: {
      width: theme.spacing.lg,
      height: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export type MiniCategorySelectorStyles = ReturnType<typeof createMiniCategorySelectorStyles>;
