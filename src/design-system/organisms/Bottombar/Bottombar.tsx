/**
 * Bottombar Organism Component
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { createBottombarStyles } from './Bottombar.styles';
import type { BottombarProps } from './Bottombar.types';

export function Bottombar({ children, ...viewProps }: BottombarProps): ReactElement {
  const { theme } = useTheme();
  const styles = createBottombarStyles(theme);

  return (
    <View style={styles.container} {...viewProps}>
      {/* Import and compose atoms + molecules here */}
      {children}
    </View>
  );
}
