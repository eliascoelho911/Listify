/**
 * FAB (Floating Action Button) Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { FABSize } from './FAB.types';

const sizeConfig = {
  md: {
    size: 48,
    iconSize: 24,
  },
  lg: {
    size: 56,
    iconSize: 28,
  },
};

export const createFABStyles = (theme: Theme, size: FABSize) => {
  const config = sizeConfig[size];

  return StyleSheet.create({
    container: {
      width: config.size,
      height: config.size,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      transform: [{ scale: 0.95 }],
      opacity: 0.9,
    },
  });
};

export const getIconSize = (size: FABSize): number => {
  return sizeConfig[size].iconSize;
};
