/**
 * DraggableList Organism Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createDraggableListStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: theme.spacing.xl,
    },
  });
};
