/**
 * ShoppingListScreen Presentation Component
 *
 * Displays a shopping list with items that can be checked off.
 * Shows a TotalBar at the bottom with the sum of all checked item prices.
 * Supports real-time total calculation as items are toggled.
 * Supports drag and drop reordering of items.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, GripVertical, Plus } from 'lucide-react-native';

import { useAppDependencies } from '@app/di';
import type { ShoppingItem } from '@domain/item';
import { useItemStoreWithDI } from '@presentation/hooks';
import { FAB } from '@design-system/atoms';
import { EmptyState, ShoppingItemCard, TotalBar } from '@design-system/molecules';
import type { DraggableListRenderItemParams, NavbarAction } from '@design-system/organisms';
import { DraggableList, Navbar } from '@design-system/organisms';
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
  const { items, isLoading, loadByListId, clearItems, toggleChecked, updateSortOrder } =
    itemStore();

  const [listName, setListName] = useState<string>('');
  const [isReorderMode, setIsReorderMode] = useState(false);

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

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleToggleReorderMode = useCallback(() => {
    setIsReorderMode((prev) => !prev);
  }, []);

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

  const handleDragEnd = useCallback(
    async (reorderedItems: ShoppingItem[]) => {
      console.debug('[ShoppingListScreen] Drag end, updating sort order');
      await updateSortOrder(reorderedItems, 'shopping');
    },
    [updateSortOrder],
  );

  const shoppingItems = useMemo(
    () =>
      items
        .filter((item): item is ShoppingItem => item.type === 'shopping')
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [items],
  );

  const totals = useMemo(() => calculateTotal(shoppingItems), [shoppingItems]);

  const renderDraggableItem = useCallback(
    ({ item, drag, isActive }: DraggableListRenderItemParams<ShoppingItem>) => (
      <View style={styles.itemContainer}>
        <ShoppingItemCard
          item={item}
          onToggle={handleItemToggle}
          onPress={handleItemPress}
          onLongPress={handleItemLongPress}
          showDragHandle={isReorderMode}
          isDragging={isActive}
          onDrag={drag}
          testID={`shopping-item-${item.id}`}
        />
      </View>
    ),
    [handleItemToggle, handleItemPress, handleItemLongPress, isReorderMode, styles.itemContainer],
  );

  const emptyContent = (
    <EmptyState
      icon={Plus}
      title={t('shopping.empty.title', 'Lista vazia')}
      subtitle={t('shopping.empty.description', 'Adicione itens usando o botão +')}
    />
  );

  const leftAction: NavbarAction = useMemo(
    () => ({
      icon: ArrowLeft,
      onPress: handleBackPress,
      label: t('common.back', 'Voltar'),
    }),
    [handleBackPress, t],
  );

  const rightActions: NavbarAction[] = useMemo(
    () => [
      {
        icon: GripVertical,
        onPress: handleToggleReorderMode,
        label: t('shopping.reorder', 'Reordenar'),
        variant: isReorderMode ? 'accent' : 'ghost',
        isActive: isReorderMode,
      },
    ],
    [handleToggleReorderMode, isReorderMode, t],
  );

  return (
    <View style={styles.container}>
      <Navbar title={listName} leftAction={leftAction} rightActions={rightActions} />

      {!isLoading && shoppingItems.length === 0 ? (
        <View style={styles.emptyContainer}>{emptyContent}</View>
      ) : (
        <DraggableList
          data={shoppingItems}
          renderItem={renderDraggableItem}
          onDragEnd={handleDragEnd}
          isReorderEnabled={isReorderMode}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={emptyContent}
        />
      )}

      <TotalBar
        total={totals.total}
        checkedCount={totals.checkedCount}
        totalCount={totals.totalCount}
        itemsWithoutPrice={totals.itemsWithoutPrice}
        testID="shopping-total-bar"
      />

      <View style={styles.fabContainer}>
        <FAB
          icon={Plus}
          onPress={handleAddItem}
          accessibilityLabel={t('shopping.addItem', 'Adicionar Item')}
          testID="shopping-add-fab"
        />
      </View>
    </View>
  );
}

const createStyles = (
  theme: {
    colors: { background: string };
    spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
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
    itemContainer: {
      marginVertical: theme.spacing.xs,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    fabContainer: {
      position: 'absolute',
      right: theme.spacing.lg,
      bottom: 80,
    },
  });
