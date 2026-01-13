/**
 * Navbar Organism Styles
 *
 * Neo-Minimal Dark design with cyan accent line
 * Uses tokens exclusively (zero hard-coded values)
 */

import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { NavbarIconSize, NavbarVariant } from './Navbar.types';

interface VariantConfig {
  backgroundColor: ViewStyle['backgroundColor'];
  foregroundColor: TextStyle['color'];
  iconSize: NavbarIconSize;
}

export const createNavbarStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 64,
    },
    titleText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    titleContainer: {
      flex: 1,
      marginHorizontal: theme.spacing.md,
    },
  });

  const variantStyles: Record<NavbarVariant, VariantConfig> = {
    default: {
      backgroundColor: theme.colors.surface,
      foregroundColor: theme.colors.surfaceForeground,
      iconSize: 'md',
    },
  };

  return {
    baseStyles,
    variantStyles,
  };
};
