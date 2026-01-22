/**
 * HistoryDetailScreen Presentation Component
 *
 * Displays the details of a purchase history entry.
 * Allows users to re-add items to the shopping list with options:
 * - "Buy all again" to add all items
 * - Individual item selection
 * - Quantity sum for items that already exist in the list
 */

import { ArrowLeft } from 'lucide-react-native';
import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AddAllButton } from '@design-system/atoms';
import { SelectableItemList } from '@design-system/molecules';
import type { SelectableItemListItem } from '@design-system/molecules/SelectableItemList/SelectableItemList.types';
import { Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';
import type { Theme } from '@design-system/theme/theme';
import type { CreateShoppingItemInput, ShoppingItem } from '@domain/item';
import type {
  PurchaseHistory,
  PurchaseHistoryItem,
} from '@domain/purchase-history/entities/purchase-history.entity';
import {
  useItemStoreWithDI,
  usePurchaseHistoryStoreWithDI,
} from '@presentation/hooks';

const createStyles = (theme: Theme, topInset: number, bottomInset: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    navbarContainer: {
      paddingTop: topInset,
      backgroundColor: theme.colors.topbar,
    },
    content: {
      flex: 1,
    },
    footer: {
      padding: theme.spacing.md,
      paddingBottom: bottomInset + theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
  });

export function HistoryDetailScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { historyId, listId } = useLocalSearchParams<{ historyId: string; listId: string }>();
  const styles = createStyles(theme, insets.top, insets.bottom);

  // Stores
  const historyStore = usePurchaseHistoryStoreWithDI();
  const itemStore = useItemStoreWithDI();

  const { getById } = historyStore();
  const { items: currentListItems, loadByListId, createItem } = itemStore();

  // Local state
  const [historyEntry, setHistoryEntry] = useState<PurchaseHistory | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Load history entry and current list items
  useEffect(() => {
    async function loadData() {
      if (!historyId || !listId) return;

      setIsLoading(true);
      try {
        const [entry] = await Promise.all([
          getById(historyId),
          loadByListId(listId, 'shopping'),
        ]);
        setHistoryEntry(entry);
      } catch (error) {
        console.error('[HistoryDetailScreen] Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [historyId, listId, getById, loadByListId]);

  // Map history items with existsInList flag
  const selectableItems: SelectableItemListItem[] = useMemo(() => {
    if (!historyEntry) return [];

    const currentTitles = new Set(
      (currentListItems as ShoppingItem[]).map((item) => item.title.toLowerCase()),
    );

    return historyEntry.items.map((historyItem: PurchaseHistoryItem) => ({
      ...historyItem,
      existsInList: currentTitles.has(historyItem.title.toLowerCase()),
    }));
  }, [historyEntry, currentListItems]);

  // Selection handlers
  const handleSelectionChange = useCallback((itemId: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(selectableItems.map((item) => item.originalItemId)));
  }, [selectableItems]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Add selected items to list
  const addItemsToList = useCallback(
    async (itemsToAdd: SelectableItemListItem[]) => {
      if (!listId) return;

      setIsAdding(true);

      try {
        const currentItems = currentListItems as ShoppingItem[];
        const currentItemsByTitle = new Map(
          currentItems.map((item) => [item.title.toLowerCase(), item]),
        );

        for (const historyItem of itemsToAdd) {
          const existingItem = currentItemsByTitle.get(historyItem.title.toLowerCase());

          if (existingItem) {
            // Item exists - sum quantities
            const existingQty = parseQuantity(existingItem.quantity);
            const newQty = parseQuantity(historyItem.quantity);
            const summedQty = existingQty + newQty;

            // Format the new quantity string
            const qtyUnit = extractUnit(historyItem.quantity || existingItem.quantity);
            const newQuantityStr =
              summedQty > 0 ? (qtyUnit ? `${summedQty} ${qtyUnit}` : String(summedQty)) : undefined;

            // Update existing item with summed quantity
            await itemStore().updateItem(existingItem.id, 'shopping', {
              quantity: newQuantityStr,
            });

            console.debug(
              `[HistoryDetailScreen] Updated quantity for "${existingItem.title}": ${existingItem.quantity} + ${historyItem.quantity} = ${newQuantityStr}`,
            );
          } else {
            // New item - create it
            const maxSortOrder = Math.max(0, ...currentItems.map((i) => i.sortOrder));
            const input: CreateShoppingItemInput = {
              type: 'shopping',
              listId,
              title: historyItem.title,
              quantity: historyItem.quantity,
              price: historyItem.price,
              sortOrder: maxSortOrder + 1,
              isChecked: false,
            };

            await createItem(input);
            console.debug(`[HistoryDetailScreen] Created item: "${historyItem.title}"`);
          }
        }

        // Reload current list items to update existsInList flags
        await loadByListId(listId, 'shopping');

        // Clear selection after successful add
        setSelectedIds(new Set());
      } catch (error) {
        console.error('[HistoryDetailScreen] Failed to add items:', error);
      } finally {
        setIsAdding(false);
      }
    },
    [listId, currentListItems, createItem, loadByListId, itemStore],
  );

  // "Buy all again" handler
  const handleBuyAllAgain = useCallback(async () => {
    await addItemsToList(selectableItems);
  }, [addItemsToList, selectableItems]);

  // "Add selected" handler
  const handleAddSelected = useCallback(async () => {
    const selectedItems = selectableItems.filter((item) =>
      selectedIds.has(item.originalItemId),
    );
    await addItemsToList(selectedItems);
  }, [addItemsToList, selectableItems, selectedIds]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Format purchase date for navbar title
  const formattedDate = useMemo(() => {
    if (!historyEntry) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(historyEntry.purchaseDate);
  }, [historyEntry]);

  return (
    <View style={styles.container}>
      <View style={styles.navbarContainer}>
        <Navbar
          title={formattedDate || t('history.detail.title', 'Compra')}
          variant="default"
          leftIcon={ArrowLeft}
          onLeftPress={handleBack}
          testID="history-detail-navbar"
        />
      </View>

      <View style={styles.content}>
        <SelectableItemList
          items={selectableItems}
          selectedIds={selectedIds}
          onSelectionChange={handleSelectionChange}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          isLoading={isLoading}
          testID="history-detail-items"
        />
      </View>

      <View style={styles.footer}>
        {selectedIds.size > 0 ? (
          <AddAllButton
            label={t('history.detail.addSelected', 'Adicionar selecionados')}
            itemCount={selectedIds.size}
            onPress={handleAddSelected}
            loading={isAdding}
            disabled={isAdding}
            testID="history-detail-add-selected-button"
          />
        ) : (
          <AddAllButton
            label={t('history.detail.buyAllAgain', 'Comprar tudo novamente')}
            itemCount={selectableItems.length}
            onPress={handleBuyAllAgain}
            loading={isAdding}
            disabled={isAdding || selectableItems.length === 0}
            testID="history-detail-buy-all-button"
          />
        )}
      </View>
    </View>
  );
}

/**
 * Parse quantity string to number
 * Examples: "2 un" -> 2, "500g" -> 500, "1.5 kg" -> 1.5
 */
function parseQuantity(quantity: string | undefined): number {
  if (!quantity) return 1;

  const match = quantity.match(/^([\d.,]+)/);
  if (match) {
    return parseFloat(match[1].replace(',', '.')) || 1;
  }
  return 1;
}

/**
 * Extract unit from quantity string
 * Examples: "2 un" -> "un", "500g" -> "g", "1.5 kg" -> "kg"
 */
function extractUnit(quantity: string | undefined): string {
  if (!quantity) return '';

  const match = quantity.match(/[\d.,]+\s*(.+)/);
  if (match) {
    return match[1].trim();
  }
  return '';
}
