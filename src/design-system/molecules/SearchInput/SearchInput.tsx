/**
 * SearchInput Molecule Component
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { createSearchInputStyles } from './SearchInput.styles';
import type { SearchInputProps } from './SearchInput.types';

export function SearchInput({ children, ...viewProps }: SearchInputProps): ReactElement {
  const { theme } = useTheme();
  const styles = createSearchInputStyles(theme);

  return (
    <View style={styles.container} {...viewProps}>
      {/* Import and compose atoms here */}
      {children}
    </View>
  );
}
