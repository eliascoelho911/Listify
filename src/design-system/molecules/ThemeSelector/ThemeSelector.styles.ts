/**
 * ThemeSelector Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createThemeSelectorStyles = (theme: Theme, isSelected: boolean) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'column',
      gap: theme.spacing.sm,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.card,
      borderWidth: 2,
      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
    },
    optionSelected: {
      backgroundColor: theme.colors.primary,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.radii.md,
      backgroundColor: isSelected ? theme.colors.primaryForeground : theme.colors.muted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
    label: {
      fontSize: theme.typography.sizes.base,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.foreground,
    },
    labelSelected: {
      color: theme.colors.primaryForeground,
    },
    description: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
      marginTop: theme.spacing.xs,
    },
    descriptionSelected: {
      color: theme.colors.primaryForeground,
      opacity: 0.8,
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.primaryForeground,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
