/**
 * PriceBadge Atom Component
 *
 * Displays a formatted price value with currency formatting.
 * Used in shopping lists and anywhere prices need to be displayed.
 */

import React, { type ReactElement, useMemo } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { Text } from '../Text/Text';
import { createPriceBadgeStyles } from './PriceBadge.styles';
import type { PriceBadgeProps } from './PriceBadge.types';

function formatPrice(price: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
}

export function PriceBadge({
  price,
  currency = 'BRL',
  locale = 'pt-BR',
  size = 'md',
  showBackground = false,
  style,
  testID,
}: PriceBadgeProps): ReactElement {
  const { theme } = useTheme();
  const styles = createPriceBadgeStyles(theme, { size, showBackground });

  const formattedPrice = useMemo(
    () => formatPrice(price, locale, currency),
    [price, locale, currency],
  );

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={styles.text} accessibilityLabel={formattedPrice}>
        {formattedPrice}
      </Text>
    </View>
  );
}
