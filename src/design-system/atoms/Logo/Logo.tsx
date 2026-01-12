/**
 * Logo Atom Component
 *
 * Logo "Listify" estilizado.
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { Text } from '../Text/Text';
import { createLogoStyles } from './Logo.styles';
import type { LogoProps } from './Logo.types';

export function Logo({ size = 'md', ...viewProps }: LogoProps): ReactElement {
  const { theme } = useTheme();
  const styles = createLogoStyles(theme, size);

  return (
    <View style={styles.container} {...viewProps}>
      <Text style={styles.text}>Listify</Text>
    </View>
  );
}
