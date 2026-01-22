/**
 * TotalBar Molecule Component
 *
 * Bottom bar that displays the total value of a shopping list.
 * Shows the sum of all priced items and indicates items without prices.
 */

import React, { type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createTotalBarStyles } from './TotalBar.styles';
import type { TotalBarProps } from './TotalBar.types';

function formatPrice(price: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
}

export function TotalBar({
  total,
  checkedCount,
  totalCount,
  itemsWithoutPrice = 0,
  currency = 'BRL',
  locale = 'pt-BR',
  style,
  testID,
}: TotalBarProps): ReactElement {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createTotalBarStyles(theme);

  const formattedTotal = useMemo(
    () => formatPrice(total, locale, currency),
    [total, locale, currency],
  );

  const progressText = useMemo(
    () => t('shopping.progress', { checked: checkedCount, total: totalCount }),
    [checkedCount, totalCount, t],
  );

  const warningText = useMemo(() => {
    if (itemsWithoutPrice <= 0) return null;
    return t('shopping.itemsWithoutPrice', { count: itemsWithoutPrice });
  }, [itemsWithoutPrice, t]);

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.leftSection}>
        <Text style={styles.totalLabel}>{t('shopping.total')}</Text>
        <Text style={styles.totalValue} accessibilityLabel={formattedTotal}>
          {formattedTotal}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.progressText}>{progressText}</Text>
        {warningText && (
          <Text style={styles.warningText} testID={testID ? `${testID}-warning` : undefined}>
            {warningText}
          </Text>
        )}
      </View>
    </View>
  );
}
