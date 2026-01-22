/**
 * CompleteButton Molecule Component
 *
 * Button for completing a purchase and saving to history.
 * Shows total value and item count.
 */

import React, { type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createCompleteButtonStyles } from './CompleteButton.styles';
import type { CompleteButtonProps } from './CompleteButton.types';

export function CompleteButton({
  onPress,
  total,
  checkedCount,
  isLoading = false,
  disabled = false,
  label,
  style,
  testID,
}: CompleteButtonProps): ReactElement {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createCompleteButtonStyles(theme);

  const isDisabled = disabled || isLoading || checkedCount === 0;

  const formattedTotal = useMemo(() => {
    return `R$${total.toFixed(2).replace('.', ',')}`;
  }, [total]);

  const effectiveLabel = label ?? t('shopping.completePurchase', 'Concluir compra');

  const itemsText = useMemo(() => {
    return checkedCount === 1
      ? t('shopping.itemCount.singular', '{{count}} item', { count: checkedCount })
      : t('shopping.itemCount.plural', '{{count}} itens', { count: checkedCount });
  }, [checkedCount, t]);

  return (
    <Pressable
      style={[styles.container, isDisabled && styles.containerDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={effectiveLabel}
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.primaryForeground} />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Icon icon={Check} size="md" color={theme.colors.primaryForeground} />
          </View>
          <View style={styles.content}>
            <Text style={styles.label}>{effectiveLabel}</Text>
            <View style={styles.details}>
              <Text style={styles.detailText}>{itemsText}</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.totalText}>{formattedTotal}</Text>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}
