/**
 * Bottombar Organism Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createBottombarStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: theme.colors.card,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingBottom: theme.spacing.sm,
      paddingTop: theme.spacing.xs,
    },
    tabsContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    leftTabs: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    rightTabs: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    fabContainer: {
      marginTop: -theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
