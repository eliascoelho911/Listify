/**
 * SwipeToDelete Molecule Styles
 *
 * Swipeable container that reveals delete action when swiped left.
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createSwipeToDeleteStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      position: 'relative',
      overflow: 'hidden',
    },
    contentContainer: {
      backgroundColor: theme.colors.card,
    },
    deleteActionContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.destructive,
      paddingHorizontal: theme.spacing.xl,
    },
    deleteActionText: {
      color: theme.colors.destructiveForeground,
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.medium,
    },
    deleteIcon: {
      marginBottom: theme.spacing.xs,
    },
  });
};
