/**
 * SortingControls Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createSortingControlsStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    label: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
    },
    optionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.muted,
    },
    optionButtonSelected: {
      backgroundColor: theme.colors.primary,
    },
    optionButtonDisabled: {
      opacity: 0.5,
    },
    optionText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.foreground,
    },
    optionTextSelected: {
      color: theme.colors.primaryForeground,
      fontWeight: theme.typography.weights.medium as '500',
    },
    directionButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.muted,
    },
    directionButtonDisabled: {
      opacity: 0.5,
    },
  });
};
