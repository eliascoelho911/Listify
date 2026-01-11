/**
 * Label Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createLabelStyles = (theme: Theme) => {
  return StyleSheet.create({
    label: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.foreground,
      marginBottom: theme.spacing.xs,
    },
    required: {
      color: theme.colors.destructive,
      marginLeft: theme.spacing.xs,
    },
    disabled: {
      opacity: 0.5,
    },
  });
};
