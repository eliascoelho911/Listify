/**
 * ScreenTitle Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createScreenTitleStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.xs,
    },
    title: {
      color: theme.colors.foreground,
    },
    subtitle: {
      color: theme.colors.mutedForeground,
    },
  });
};
