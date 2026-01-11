import type { ReactElement } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { theme } from '@legacy-design-system/theme/theme';

import type { ShoppingItem } from '@domain/shopping/entities/ShoppingItem';
import { formatMoney } from '@presentation/utils/price';
import { Text } from '@design-system/atoms';

type ShoppingItemRowProps = {
  item: ShoppingItem;
  currencyCode: string;
  onToggleStatus: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onPress?: (itemId: string) => void;
};

export function ShoppingItemRow({
  item,
  currencyCode,
  onToggleStatus,
  onRemove,
  onPress,
}: ShoppingItemRowProps): ReactElement {
  const swipeableRef = useRef<Swipeable>(null);
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const unitLabel = t(`units.${item.unit}`, { defaultValue: item.unit });
  const quantityValue = item.quantity.toNumber();
  const totalPriceMinor = resolveTotalPriceMinor(item, quantityValue);
  const unitPriceMinor = resolveUnitPriceMinor(item, totalPriceMinor, quantityValue);

  const handleToggle = (): void => {
    onToggleStatus(item.id);
  };

  const handleRemove = (): void => {
    swipeableRef.current?.close();
    onRemove(item.id);
  };

  const handlePress = (): void => {
    if (onPress) {
      onPress(item.id);
      return;
    }
    onToggleStatus(item.id);
  };

  return (
    <Swipeable
      ref={swipeableRef}
      style={styles.swipeContainer}
      overshootRight={false}
      renderRightActions={() => (
        <View style={styles.deleteActionContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('shoppingList.actions.delete')}
            style={({ pressed }) => [styles.deleteAction, pressed && styles.deleteActionPressed]}
            onPress={handleRemove}
          >
            <Text style={styles.deleteActionText}>{t('shoppingList.actions.delete')}</Text>
          </Pressable>
        </View>
      )}
    >
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        style={({ pressed }) => [
          styles.container,
          pressed && styles.containerPressed,
          item.status === 'purchased' && styles.purchasedContainer,
        ]}
      >
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.status === 'purchased' }}
          onPress={handleToggle}
          style={[
            styles.checkbox,
            item.status === 'purchased' && styles.checkboxChecked,
            item.status === 'pending' && styles.checkboxPending,
          ]}
        >
          {item.status === 'purchased' ? <Text style={styles.checkboxMark}>{'\u2713'}</Text> : null}
        </Pressable>

        <View style={styles.content}>
          <Text
            style={[styles.title, item.status === 'purchased' && styles.titlePurchased]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.meta}>
            {formatQuantity(item, locale)} • {unitLabel}
          </Text>
        </View>
        {totalPriceMinor !== undefined || unitPriceMinor !== undefined ? (
          <View style={styles.priceBlock}>
            {totalPriceMinor !== undefined ? (
              <Text
                style={[
                  styles.priceTotal,
                  item.status === 'purchased' && styles.priceTotalPurchased,
                ]}
              >
                {formatMoney(totalPriceMinor, currencyCode, locale)}
              </Text>
            ) : null}
            {unitPriceMinor !== undefined ? (
              <Text style={styles.priceUnit}>
                {t('shoppingList.item.unitPrice', {
                  price: formatMoney(unitPriceMinor, currencyCode, locale),
                  unit: unitLabel,
                })}
              </Text>
            ) : null}
          </View>
        ) : null}
      </Pressable>
    </Swipeable>
  );
}

function formatQuantity(item: ShoppingItem, locale: string): string {
  const formatter = new Intl.NumberFormat(locale);
  return formatter.format(item.quantity.toNumber());
}

function resolveTotalPriceMinor(item: ShoppingItem, quantityValue: number): number | undefined {
  if (typeof item.totalPriceMinor === 'number' && Number.isFinite(item.totalPriceMinor)) {
    return item.totalPriceMinor;
  }
  if (typeof item.unitPriceMinor === 'number' && Number.isFinite(item.unitPriceMinor)) {
    return Math.round(quantityValue * item.unitPriceMinor);
  }
  return undefined;
}

function resolveUnitPriceMinor(
  item: ShoppingItem,
  totalPriceMinor: number | undefined,
  quantityValue: number,
): number | undefined {
  if (typeof item.unitPriceMinor === 'number' && Number.isFinite(item.unitPriceMinor)) {
    return item.unitPriceMinor;
  }
  if (
    typeof totalPriceMinor === 'number' &&
    Number.isFinite(totalPriceMinor) &&
    quantityValue > 0
  ) {
    return Math.round(totalPriceMinor / quantityValue);
  }
  return undefined;
}

const styles = StyleSheet.create({
  swipeContainer: {
    marginBottom: theme.spacing.xs,
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.surface,
    gap: theme.spacing.sm,
  },
  containerPressed: {
    backgroundColor: theme.colors.background.muted,
  },
  purchasedContainer: {
    opacity: 0.85,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: theme.radii.md,
    borderWidth: 2,
    borderColor: theme.colors.border.muted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.surface,
  },
  checkboxPending: {
    borderColor: theme.colors.brand[600],
  },
  checkboxChecked: {
    backgroundColor: theme.colors.brand[600],
    borderColor: theme.colors.brand[600],
  },
  checkboxMark: {
    color: theme.colors.content.inverse,
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.bold,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  priceBlock: {
    alignItems: 'flex-end',
    gap: theme.spacing.xxs,
  },
  priceTotal: {
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
    color: theme.colors.content.primary,
  },
  priceTotalPurchased: {
    color: theme.colors.content.muted,
  },
  priceUnit: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.xs,
    lineHeight: theme.typography.sizes.xs * theme.typography.lineHeights.normal,
    color: theme.colors.content.muted,
  },
  title: {
    fontFamily: theme.typography.families.heading,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.normal,
    color: theme.colors.content.primary,
  },
  titlePurchased: {
    color: theme.colors.content.muted,
    textDecorationLine: 'line-through',
  },
  meta: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
    color: theme.colors.content.secondary,
  },
  deleteActionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deleteAction: {
    backgroundColor: theme.colors.danger[600],
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: theme.radii.lg,
    borderBottomLeftRadius: theme.radii.lg,
  },
  deleteActionPressed: {
    backgroundColor: theme.colors.danger[700],
  },
  deleteActionText: {
    color: theme.colors.content.inverse,
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.semibold,
  },
});
