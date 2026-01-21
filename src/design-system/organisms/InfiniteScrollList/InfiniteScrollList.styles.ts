/**
 * InfiniteScrollList Organism Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createInfiniteScrollListStyles = (theme: Theme, itemGap: number, groupGap: number) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      paddingBottom: theme.spacing.xxl,
    },
    groupContainer: {
      marginBottom: groupGap,
    },
    itemContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: itemGap,
    },
    footerContainer: {
      paddingVertical: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingIndicator: {
      paddingVertical: theme.spacing.md,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xxl,
    },
  });
};
