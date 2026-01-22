/**
 * Bottombar Organism Styles
 *
 * Floating pill-shaped bottom bar with notch cutout for FAB
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

/**
 * Configuration for the bottom bar dimensions
 */
export const BOTTOMBAR_CONFIG = {
  height: 64,
  fabSize: 64,
  fabIconSize: 28,
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
    // Inner container that holds the SVG background and content
    container: {
      height: BOTTOMBAR_CONFIG.height,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      // Strong shadow for floating effect and contrast
      shadowColor: theme.colors.shadowBase,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 12,
    },
    // Left tabs container
    leftTabs: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      zIndex: 1,
    },
    // Right tabs container
    rightTabs: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      zIndex: 1,
    },
    // FAB container - positioned absolutely to allow elevation above the bar
    fabContainer: {
      position: 'absolute',
      top:
        -(BOTTOMBAR_CONFIG.fabSize * 0.5) +
        BOTTOMBAR_CONFIG.height * 0.5 -
        BOTTOMBAR_CONFIG.fabSize * 0.08,
      left: '50%',
      marginLeft: -(BOTTOMBAR_CONFIG.fabSize / 2),
      zIndex: 10,
    },
    // Center spacer to maintain layout around the FAB
    centerSpacer: {
      width: BOTTOMBAR_CONFIG.fabSize + theme.spacing.md * 2,
    },
  });
};
