import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import type { CategoryItems } from '@domain/shopping/use-cases/GetActiveListState';
import { theme } from '@design-system/theme/theme';

import { ShoppingItemRow } from './ShoppingItemRow';

type CategorySectionProps = {
  category: CategoryItems;
  onToggleItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onPressItem?: (itemId: string) => void;
};

export function CategorySection({
  category,
  onToggleItem,
  onRemoveItem,
  onPressItem,
}: CategorySectionProps): ReactElement | null {
  const { t } = useTranslation();
  const hasItems = category.items.pending.length + category.items.purchased.length > 0;
  if (!hasItems) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{formatCategoryLabel(category, t)}</Text>
        <Text style={styles.counter}>
          {t('shoppingList.category.count', {
            count: category.items.pending.length + category.items.purchased.length,
          })}
        </Text>
      </View>

      <View style={styles.items}>
        {category.items.pending.map((item) => (
          <ShoppingItemRow
            key={item.id}
            item={item}
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
