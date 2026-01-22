/**
 * ShoppingListScreen Presentation Component
 *
 * Displays a shopping list with items that can be checked off.
 * Shows a TotalBar at the bottom with the sum of all checked item prices.
 * Supports real-time total calculation as items are toggled.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';

import type { ShoppingItem } from '@domain/item';
import { useAppDependencies } from '@app/di';
import { useItemStoreWithDI } from '@presentation/hooks';
import { FAB, IconButton } from '@design-system/atoms';
import { EmptyState, ShoppingItemCard, TotalBar } from '@design-system/molecules';
import { Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

interface TotalCalculation {
  total: number;
  checkedCount: number;
  totalCount: number;
  itemsWithoutPrice: number;
}

function calculateTotal(items: ShoppingItem[]): TotalCalculation {
  let total = 0;
  let checkedCount = 0;
  let itemsWithoutPrice = 0;

  for (const item of items) {
    if (item.isChecked) {
      checkedCount++;
      if (item.price !== undefined && item.price > 0) {
        total += item.price;
      }
    }
    if (item.price === undefined || item.price === 0) {
      itemsWithoutPrice++;
    }
  }

  return {
    total,
    checkedCount,
    totalCount: items.length,
    itemsWithoutPrice,
  };
}

export function ShoppingListScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { id: listId } = useLocalSearchParams<{ id: string }>();
  const styles = createStyles(theme, insets.top);

  const { listRepository } = useAppDependencies();
  const itemStore = useItemStoreWithDI();
  const { items, isLoading, loadByListId, clearItems, toggleChecked } = itemStore();

  const [listName, setListName] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (listId) {
      loadByListId(listId, 'shopping');
      listRepository.getById(listId).then((list) => {
        if (list) {
          setListName(list.name);
        }
      });
    }
    return () => clearItems();
  }, [listId, loadByListId, clearItems, listRepository]);

  const handleRefresh = useCallback(async () => {
    if (!listId) return;
    setRefreshing(true);
    await loadByListId(listId, 'shopping');
    setRefreshing(false);
  }, [listId, loadByListId]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleItemToggle = useCallback(
    async (item: ShoppingItem, checked: boolean) => {
      console.debug('[ShoppingListScreen] Toggle item:', item.id, checked);
      await toggleChecked(item.id, 'shopping');
    },
    [toggleChecked],
  );

  const handleItemPress = useCallback((item: ShoppingItem) => {
    console.debug('[ShoppingListScreen] Item pressed:', item.id);
    // TODO: Open item edit modal
  }, []);

  const handleItemLongPress = useCallback((item: ShoppingItem) => {
    console.debug('[ShoppingListScreen] Item long pressed:', item.id);
    // TODO: Open context menu
  }, []);

  const handleAddItem = useCallback(() => {
    console.debug('[ShoppingListScreen] Add item');
    // TODO: Open add item modal
  }, []);

  const shoppingItems = useMemo(
    () => items.filter((item): item is ShoppingItem => item.type === 'shopping'),
    [items],
  );

  const totals = useMemo(() => calculateTotal(shoppingItems), [shoppingItems]);

  const renderItem = useCallback(
    ({ item }: { item: ShoppingItem }) => (
      <ShoppingItemCard
        item={item}
        onToggle={handleItemToggle}
        onPress={handleItemPress}
        onLongPress={handleItemLongPress}
        testID={`shopping-item-${item.id}`}
      />
    ),
    [handleItemToggle, handleItemPress, handleItemLongPress],
  );

  const keyExtractor = useCallback((item: ShoppingItem) => item.id, []);

  const ItemSeparator = useCallback(() => <View style={styles.separator} />, [styles.separator]);

  const emptyContent = (
    <EmptyState
      icon={Plus}
      title={t('shopping.empty.title', 'Lista vazia')}
      subtitle={t('shopping.empty.description', 'Adicione itens usando o botão +')}
    />
  );

  return (
    <View style={styles.container}>
      <Navbar
        title={listName}
        leftActions={[
          {
            icon: ArrowLeft,
            onPress: handleBackPress,
            label: t('common.back', 'Voltar'),
          },
        ]}
      />

      {!isLoading && shoppingItems.length === 0 ? (
        <View style={styles.emptyContainer}>{emptyContent}</View>
      ) : (
        <FlatList
          data={shoppingItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TotalBar
        total={totals.total}
        checkedCount={totals.checkedCount}
        totalCount={totals.totalCount}
        itemsWithoutPrice={totals.itemsWithoutPrice}
        testID="shopping-total-bar"
      />

      <FAB
        icon={Plus}
        onPress={handleAddItem}
        label={t('shopping.addItem', 'Adicionar Item')}
        style={styles.fab}
        testID="shopping-add-fab"
      />
    </View>
  );
}

const createStyles = (
  theme: {
    colors: { background: string };
    spacing: { sm: number; md: number; lg: number; xl: number };
  },
  topInset: number,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: topInset,
    },
    listContent: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      paddingBottom: 120,
    },
    separator: {
      height: theme.spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    fab: {
      position: 'absolute',
      right: theme.spacing.lg,
      bottom: 80,
    },
  });
