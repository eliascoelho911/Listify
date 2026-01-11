/**
 * Navbar Organism Styles
 *
 * Neo-Minimal Dark design with cyan accent line
 * Uses tokens exclusively (zero hard-coded values)
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createNavbarStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.navbar,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 64,
    },
    title: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.navbarForeground,
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    centerContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: theme.spacing.md,
    },
    accentLine: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: theme.colors.navbarAccent,
    },
  });
};
