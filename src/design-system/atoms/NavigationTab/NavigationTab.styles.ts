/**
 * NavigationTab Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createNavigationTabStyles = (theme: Theme, isActive: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      minHeight: 48,
    },
    label: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      fontWeight: isActive ? theme.typography.weights.semibold : theme.typography.weights.regular,
      color: isActive ? theme.colors.primary : theme.colors.mutedForeground,
      marginTop: theme.spacing.xs,
    },
  });
};

export const getIconColor = (theme: Theme, isActive: boolean): string => {
  return isActive ? theme.colors.primary : theme.colors.mutedForeground;
};
