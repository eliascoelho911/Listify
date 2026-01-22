/**
 * SelectableItemList Molecule Component
 *
 * A list component that displays purchase history items with checkboxes
 * for individual selection. Used for re-adding items from purchase history.
 * Includes visual indication for items that already exist in the current list.
 */

import React, { type ReactElement, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { useTheme } from '../../theme';
import { createSelectableItemListStyles } from './SelectableItemList.styles';
import type {
  SelectableItemListItem,
  SelectableItemListProps,
} from './SelectableItemList.types';

export function SelectableItemList({
  items,
  selectedIds,
  onSelectionChange,
  onSelectAll,
  onDeselectAll,
  isLoading = false,
  style,
  testID,
}: SelectableItemListProps): ReactElement {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createSelectableItemListStyles(theme);

  const allSelected = useMemo(
    () => items.length > 0 && items.every((item) => selectedIds.has(item.originalItemId)),
    [items, selectedIds],
  );

  const someSelected = useMemo(
    () => items.some((item) => selectedIds.has(item.originalItemId)),
    [items, selectedIds],
  );

  const selectedCount = useMemo(() => selectedIds.size, [selectedIds]);

  const handleSelectAllToggle = useCallback(() => {
    if (allSelected && onDeselectAll) {
      onDeselectAll();
    } else if (onSelectAll) {
      onSelectAll();
    }
  }, [allSelected, onSelectAll, onDeselectAll]);

  const formatPrice = useCallback(
    (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price);
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: SelectableItemListItem }) => {
      const isSelected = selectedIds.has(item.originalItemId);
      const hasPrice = item.price !== undefined && item.price > 0;

      return (
        <Pressable
          style={[
            styles.itemContainer,
            item.existsInList && styles.itemContainerExisting,
          ]}
          onPress={() => onSelectionChange(item.originalItemId, !isSelected)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
          accessibilityLabel={`${item.title}${item.existsInList ? ', já na lista' : ''}`}
          testID={testID ? `${testID}-item-${item.originalItemId}` : undefined}
        >
          <Checkbox
            checked={isSelected}
            onToggle={(checked) => onSelectionChange(item.originalItemId, checked)}
            size="md"
          />

          <View style={styles.itemContent}>
            <Text
              style={[
                styles.itemTitle,
                item.existsInList && styles.itemTitleExisting,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            <View style={styles.itemMeta}>
              {item.quantity && (
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
              )}
              {hasPrice && (
                <Text style={styles.itemPrice}>{formatPrice(item.price!)}</Text>
              )}
            </View>
          </View>

          {item.existsInList && (
            <View style={styles.existingBadge}>
              <Text style={styles.existingBadgeText}>
                {t('shopping.history.alreadyInList')}
              </Text>
            </View>
          )}
        </Pressable>
      );
    },
    [
      selectedIds,
      onSelectionChange,
      styles,
      formatPrice,
      t,
      testID,
    ],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [styles.separator],
  );

  const keyExtractor = useCallback(
    (item: SelectableItemListItem) => item.originalItemId,
    [],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, style]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyState, style]}>
        <Text style={styles.emptyStateText}>
          {t('shopping.history.noItems')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t('shopping.history.selectedCount', { count: selectedCount })}
        </Text>

        {(onSelectAll || onDeselectAll) && (
          <Pressable
            style={styles.selectAllButton}
            onPress={handleSelectAllToggle}
            accessibilityRole="button"
            accessibilityLabel={
              allSelected
                ? t('shopping.history.deselectAll')
                : t('shopping.history.selectAll')
            }
          >
            <Text style={styles.selectAllText}>
              {allSelected || (someSelected && !allSelected)
                ? t('shopping.history.deselectAll')
                : t('shopping.history.selectAll')}
            </Text>
          </Pressable>
        )}
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
