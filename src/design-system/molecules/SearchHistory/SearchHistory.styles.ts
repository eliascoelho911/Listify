/**
 * SearchHistory Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createSearchHistoryStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      padding: theme.spacing.md,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.card,
    },
  });
};
