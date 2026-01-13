/**
 * Logo Atom Styles
 *
 * Logo "Listify" estilizado.
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { LogoSize } from './Logo.types';

const sizeMap: Record<LogoSize, number> = {
  sm: 24,
  md: 32,
  lg: 40,
};

export const createLogoStyles = (theme: Theme, size: LogoSize) => {
  const fontSize = sizeMap[size];

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      fontSize,
      fontFamily: theme.typography.families.logo,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.foreground,
    },
  });
};
