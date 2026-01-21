/**
 * FilterChip Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createFilterChipStyles = (theme: Theme, selected?: boolean, disabled?: boolean) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.full,
      borderWidth: 1,
      borderColor: selected ? theme.colors.primary : theme.colors.border,
      backgroundColor: selected ? `${theme.colors.primary}20` : theme.colors.card,
      opacity: disabled ? 0.5 : 1,
    },
    label: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium as '500',
      color: selected ? theme.colors.primary : theme.colors.foreground,
    },
  });
};
