/**
 * FormField Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createFormFieldStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.xs, // Compact spacing between label and input
    },
  });
};
