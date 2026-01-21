/**
 * SearchHistory Molecule Component
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { createSearchHistoryStyles } from './SearchHistory.styles';
import type { SearchHistoryProps } from './SearchHistory.types';

export function SearchHistory({ children, ...viewProps }: SearchHistoryProps): ReactElement {
  const { theme } = useTheme();
  const styles = createSearchHistoryStyles(theme);

  return (
    <View style={styles.container} {...viewProps}>
      {/* Import and compose atoms here */}
      {children}
    </View>
  );
}
