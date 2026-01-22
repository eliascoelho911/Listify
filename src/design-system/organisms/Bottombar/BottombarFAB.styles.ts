/**
 * BottombarFAB Styles
 *
 * Large FAB (64px) with cyan glow effect for the bottom bar
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import { BOTTOMBAR_CONFIG } from './Bottombar.styles';

export const createBottombarFABStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      width: BOTTOMBAR_CONFIG.fabSize,
      height: BOTTOMBAR_CONFIG.fabSize,
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      // Strong shadow with cyan glow
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 10,
    },
    pressed: {
      transform: [{ scale: 0.92 }],
      opacity: 0.9,
    },
  });
};
