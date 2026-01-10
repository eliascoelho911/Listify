/**
 * Navbar Organism Styles
 *
 * Uses custom topbar tokens for consistent navbar styling
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createNavbarStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.topbar,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors['topbar-border'],
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 56,
    },
    containerWithoutBorder: {
      borderBottomWidth: 0,
    },
    title: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors['topbar-foreground'],
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    actionButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.radii.md,
    },
    centerContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: theme.spacing.md,
    },
  });
};
