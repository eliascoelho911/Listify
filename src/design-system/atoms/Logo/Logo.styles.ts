/**
 * Logo Atom Styles
 *
 * Logo "Listify" estilizado.
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { LogoSize } from './Logo.types';

const sizeMap: Record<LogoSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
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
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.bold as '700',
      color: theme.colors.primary,
    },
  });
};
