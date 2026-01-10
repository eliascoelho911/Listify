import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@legacy-design-system/theme/theme';

import type { CategoryItems } from '@domain/shopping/use-cases/GetActiveListState';
import { formatMoney } from '@presentation/utils/price';

import { ShoppingItemRow } from './ShoppingItemRow';

type CategorySectionProps = {
  category: CategoryItems;
  currencyCode: string;
  onToggleItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onPressItem?: (itemId: string) => void;
};

export function CategorySection({
  category,
  currencyCode,
  onToggleItem,
  onRemoveItem,
  onPressItem,
}: CategorySectionProps): ReactElement | null {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const hasItems = category.items.pending.length + category.items.purchased.length > 0;
  if (!hasItems) {
    return null;
  }

  const totalMinor = resolveCategoryTotalMinor(category);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{formatCategoryLabel(category, t)}</Text>
        <View style={styles.headerMeta}>
          <Text style={styles.counter}>
            {t('shoppingList.category.count', {
              count: category.items.pending.length + category.items.purchased.length,
            })}
          </Text>
          {typeof totalMinor === 'number' ? (
            <Text style={styles.totalValue}>{formatMoney(totalMinor, currencyCode, locale)}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.items}>
        {category.items.pending.map((item) => (
          <ShoppingItemRow
            key={item.id}
            item={item}
            currencyCode={currencyCode}
            onToggleStatus={onToggleItem}
            onRemove={onRemoveItem}
            onPress={onPressItem}
          />
        ))}
      </View>

      {category.items.purchased.length ? (
        <View style={styles.purchasedBlock}>
          <Text style={styles.purchasedLabel}>
            {t('shoppingList.category.purchasedLabel', {
              count: category.items.purchased.length,
            })}
          </Text>
          {category.items.purchased.map((item) => (
            <ShoppingItemRow
              key={item.id}
              item={item}
              currencyCode={currencyCode}
              onToggleStatus={onToggleItem}
              onRemove={onRemoveItem}
              onPress={onPressItem}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function formatCategoryLabel(
  category: CategoryItems,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  const normalized = category.name.trim().toLowerCase();
  const translated = t(`categories.${normalized}`, { defaultValue: category.name });
  return translated || category.name;
}

function resolveCategoryTotalMinor(category: CategoryItems): number | undefined {
  const items = [...category.items.pending, ...category.items.purchased];
  let total = 0;
  let hasAnyPrice = false;

  for (const item of items) {
    const priceMinor = resolveItemPriceMinor(item);
    if (priceMinor === undefined) {
      continue;
    }
    total += priceMinor;
    hasAnyPrice = true;
  }

  return hasAnyPrice ? total : undefined;
}

function resolveItemPriceMinor(
  item: CategoryItems['items']['pending'][number],
): number | undefined {
  if (typeof item.totalPriceMinor === 'number' && Number.isFinite(item.totalPriceMinor)) {
    return item.totalPriceMinor;
  }
  if (typeof item.unitPriceMinor === 'number' && Number.isFinite(item.unitPriceMinor)) {
    return Math.round(item.quantity.toNumber() * item.unitPriceMinor);
  }
  return undefined;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.lg,
    lineHeight: theme.typography.sizes.lg * theme.typography.lineHeights.normal,
    color: theme.colors.content.primary,
  },
  counter: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
    color: theme.colors.content.muted,
  },
  totalValue: {
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
    color: theme.colors.content.primary,
  },
  items: {
    gap: theme.spacing.xs,
  },
  purchasedBlock: {
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  purchasedLabel: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
    color: theme.colors.content.muted,
    paddingHorizontal: theme.spacing.xs,
  },
});
