/**
 * SearchResultCard Molecule Component
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { createSearchResultCardStyles } from './SearchResultCard.styles';
import type { SearchResultCardProps } from './SearchResultCard.types';

export function SearchResultCard({ children, ...viewProps }: SearchResultCardProps): ReactElement {
  const { theme } = useTheme();
  const styles = createSearchResultCardStyles(theme);

  return (
    <View style={styles.container} {...viewProps}>
      {/* Import and compose atoms here */}
      {children}
    </View>
  );
}
