/**
 * {{NAME}} Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const create{{NAME}}Styles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      padding: theme.spacing.md,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.card,
    },
  });
};
