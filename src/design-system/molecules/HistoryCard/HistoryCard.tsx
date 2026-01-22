/**
 * HistoryCard Molecule Component
 *
 * Card for displaying purchase history entries.
 * Shows date, total value, and item count.
 */

import React, { type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createHistoryCardStyles } from './HistoryCard.styles';
import type { HistoryCardProps } from './HistoryCard.types';

export function HistoryCard({
  purchaseDate,
  totalValue,
  itemCount,
  onPress,
  style,
  testID,
}: HistoryCardProps): ReactElement {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const styles = createHistoryCardStyles(theme);

  const formattedDate = useMemo(() => {
    return purchaseDate.toLocaleDateString(i18n.language, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, [purchaseDate, i18n.language]);

  const formattedTotal = useMemo(() => {
    return `R$${totalValue.toFixed(2).replace('.', ',')}`;
  }, [totalValue]);

  const itemsText = useMemo(() => {
    return itemCount === 1
      ? t('history.itemCount.singular', '{{count}} item', { count: itemCount })
      : t('history.itemCount.plural', '{{count}} itens', { count: itemCount });
  }, [itemCount, t]);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={t(
        'history.cardAccessibility',
        'Compra de {{date}}, {{total}}, {{items}}',
        {
          date: formattedDate,
          total: formattedTotal,
          items: itemsText,
        },
      )}
      testID={testID}
    >
      <View style={styles.leftContent}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.itemCountText}>{itemsText}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.totalText}>{formattedTotal}</Text>
        {onPress && (
          <View style={styles.iconContainer}>
            <Icon icon={ChevronRight} size="sm" color={theme.colors.mutedForeground} />
          </View>
        )}
      </View>
    </Pressable>
  );
}
