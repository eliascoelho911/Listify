/**
 * Bottombar Organism Styles
 *
 * Floating pill-shaped bottom bar with centered FAB
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

/**
 * Configuration for the bottom bar dimensions
 */
export const BOTTOMBAR_CONFIG = {
  height: 64,
  fabSize: 48,
  fabIconSize: 24,
  horizontalMargin: 16,
  bottomMargin: 16,
};

export const createBottombarStyles = (theme: Theme) => {
  return StyleSheet.create({
    // Outer wrapper that handles positioning and margins
    wrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: BOTTOMBAR_CONFIG.horizontalMargin,
    },
    // Inner container with pill shape
    container: {
      height: BOTTOMBAR_CONFIG.height,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.bottombar,
      borderRadius: BOTTOMBAR_CONFIG.height / 2,
      borderWidth: 1,
      borderColor: theme.colors.bottombarBorder,
      // Strong shadow for floating effect and contrast
      shadowColor: theme.colors.shadowBase,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 12,
    },
    // Each item (tab or FAB) takes equal space
    item: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
