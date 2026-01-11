/**
 * {{NAME}} Molecule Component
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { create{{NAME}}Styles } from './{{NAME}}.styles';
import type { {{NAME}}Props } from './{{NAME}}.types';

export function {{NAME}}({ children, ...viewProps }: {{NAME}}Props): ReactElement {
  const { theme } = useTheme();
  const styles = create{{NAME}}Styles(theme);

  return (
    <View style={styles.container} {...viewProps}>
      {/* Import and compose atoms here */}
      {children}
    </View>
  );
}
