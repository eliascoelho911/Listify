/**
 * CategorySelector Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createCategorySelectorStyles = (theme: Theme, isSelected: boolean) => {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.card,
      borderWidth: 2,
      borderColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    optionSelected: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.primary,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: theme.radii.sm,
      backgroundColor: isSelected ? theme.colors.primary : theme.colors.muted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    label: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.foreground,
    },
    labelSelected: {
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.semibold,
    },
    description: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
