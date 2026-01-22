/**
 * SectionAddButton Atom Styles
 *
 * A small button for adding a new section to a list.
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createSectionAddButtonStyles = (theme: Theme, disabled: boolean) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.border,
      opacity: disabled ? 0.5 : 1,
    },
    pressed: {
      backgroundColor: theme.colors.accent,
    },
    icon: {
      marginRight: theme.spacing.xs,
    },
    label: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.mutedForeground,
    },
  });
};
