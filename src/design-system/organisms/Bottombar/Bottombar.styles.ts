/**
 * Bottombar Organism Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createBottombarStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.lg,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    itemContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      minWidth: 60,
    },
    activeIndicator: {
      position: 'absolute',
      top: 0,
      left: theme.spacing.md,
      right: theme.spacing.md,
      height: 2,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.sm,
    },
  });
};
