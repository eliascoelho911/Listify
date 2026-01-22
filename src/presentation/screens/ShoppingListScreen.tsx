/**
 * ShoppingListScreen Presentation Component
 *
 * Displays a shopping list with items that can be checked off.
 * Shows a TotalBar at the bottom with the sum of all checked item prices.
 * Supports real-time total calculation as items are toggled.
 * Supports drag and drop reordering of items.
 * Supports sections for organizing items.
 * Supports editing and deleting items via EditModal.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, GripVertical, History, Plus } from 'lucide-react-native';

import { useAppDependencies } from '@app/di';
import type { Item, ShoppingItem } from '@domain/item';
import type { Section } from '@domain/section';
import type { CreatePurchaseHistoryInput } from '@domain/purchase-history';
import {
  useItemStoreWithDI,
  usePurchaseHistoryStoreWithDI,
  useSectionStoreWithDI,
} from '@presentation/hooks';
import { FAB, SectionAddButton } from '@design-system/atoms';
import {
  CompleteButton,
  ConfirmationDialog,
  EmptyState,
  SectionHeader,
  ShoppingItemCard,
  TotalBar,
} from '@design-system/molecules';
import type { EditSubmitData, NavbarAction } from '@design-system/organisms';
import { EditModal, Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

interface TotalCalculation {
  total: number;
  checkedCount: number;
  totalCount: number;
  itemsWithoutPrice: number;
}

/** Type for items in the flat list - can be section header, item, or add button */
type ListItem =
  | { type: 'section-header'; section: Section | null; itemCount: number }
  | { type: 'item'; item: ShoppingItem; sectionId: string | null }
  | { type: 'add-section-button' };

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
  const sectionStore = useSectionStoreWithDI();
  const purchaseHistoryStore = usePurchaseHistoryStoreWithDI();
  const { items, isLoading, loadByListId, clearItems, toggleChecked, updateItem, deleteItem } =
    itemStore();
  const { createEntry: createHistoryEntry } = purchaseHistoryStore();
  const {
    sectionsByListId,
    expandedSections,
    loadSections,
    createSection,
    toggleSectionExpanded,
    clearSections,
  } = sectionStore();

  const [listName, setListName] = useState<string>('');
  const [isReorderMode, setIsReorderMode] = useState(false);

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  // Delete confirmation dialog state
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  // Complete purchase state
  const [isCompletingPurchase, setIsCompletingPurchase] = useState(false);
  const [completeDialogVisible, setCompleteDialogVisible] = useState(false);

  useEffect(() => {
    if (listId) {
      loadByListId(listId, 'shopping');
      loadSections(listId);
      listRepository.getById(listId).then((list) => {
        if (list) {
          setListName(list.name);
        }
      });
    }
    return () => {
      clearItems();
      if (listId) {
        clearSections(listId);
      }
    };
  }, [listId, loadByListId, loadSections, clearItems, clearSections, listRepository]);

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
    setEditingItem(item);
    setEditModalVisible(true);
  }, []);

  const handleItemLongPress = useCallback((item: ShoppingItem) => {
    console.debug('[ShoppingListScreen] Item long pressed:', item.id);
    // Open edit modal on long press as well
    setEditingItem(item);
    setEditModalVisible(true);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setEditModalVisible(false);
    setEditingItem(null);
  }, []);

  const handleEditSubmit = useCallback(
    async (data: EditSubmitData) => {
      if (!editingItem) return;

      console.debug('[ShoppingListScreen] Edit submit:', data);
      await updateItem(editingItem.id, 'shopping', {
        title: data.updates.title,
        quantity: data.updates.quantity,
        price: data.updates.price,
      });

      setEditModalVisible(false);
      setEditingItem(null);
    },
    [editingItem, updateItem],
  );

  const handleDeleteRequest = useCallback((item: Item) => {
    console.debug('[ShoppingListScreen] Delete requested:', item.id);
    setItemToDelete(item);
    setDeleteDialogVisible(true);
    setEditModalVisible(false);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!itemToDelete) return;

    console.debug('[ShoppingListScreen] Delete confirmed:', itemToDelete.id);
    await deleteItem(itemToDelete.id, 'shopping');

    setDeleteDialogVisible(false);
    setItemToDelete(null);
    setEditingItem(null);
  }, [itemToDelete, deleteItem]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogVisible(false);
    setItemToDelete(null);
  }, []);

  const handleCompletePurchasePress = useCallback(() => {
    setCompleteDialogVisible(true);
  }, []);

  const handleCompletePurchaseConfirm = useCallback(async () => {
    if (!listId || totals.checkedCount === 0) return;

    setCompleteDialogVisible(false);
    setIsCompletingPurchase(true);

    try {
      // Create snapshot of checked items for history
      const checkedItems = shoppingItems.filter((item) => item.isChecked);
      const historyInput: CreatePurchaseHistoryInput = {
        listId,
        purchaseDate: new Date(),
        totalValue: totals.total,
        sections: sections.map((section) => ({
          originalSectionId: section.id,
          name: section.name,
          sortOrder: section.sortOrder,
        })),
        items: checkedItems.map((item) => ({
          originalItemId: item.id,
          sectionId: item.sectionId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          sortOrder: item.sortOrder,
          wasChecked: true,
        })),
      };

      const entry = await createHistoryEntry(historyInput);

      if (entry) {
        console.debug('[ShoppingListScreen] Purchase history created:', entry.id);

        // Reset checked state for all checked items
        for (const item of checkedItems) {
          await updateItem(item.id, 'shopping', { isChecked: false });
        }

        console.debug('[ShoppingListScreen] Item markings reset');
      }
    } catch (error) {
      console.error('[ShoppingListScreen] Failed to complete purchase:', error);
    } finally {
      setIsCompletingPurchase(false);
    }
  }, [listId, totals, shoppingItems, sections, createHistoryEntry, updateItem]);

  const handleCompletePurchaseCancel = useCallback(() => {
    setCompleteDialogVisible(false);
  }, []);

  const handleViewHistory = useCallback(() => {
    if (listId) {
      router.push(`/history/${listId}`);
    }
  }, [listId, router]);

  const handleAddItem = useCallback(() => {
    console.debug('[ShoppingListScreen] Add item');
    // TODO: Open add item modal
  }, []);

  const handleAddSection = useCallback(async () => {
    if (!listId) return;
    console.debug('[ShoppingListScreen] Add section');

    const sections = sectionsByListId[listId] ?? [];
    const newSection = await createSection({
      listId,
      name: t('sections.newSection', 'Nova Seção'),
      sortOrder: sections.length,
    });

    if (newSection) {
      console.debug('[ShoppingListScreen] Section created:', newSection.id);
    }
  }, [listId, sectionsByListId, createSection, t]);

  const handleToggleSectionExpand = useCallback(
    (sectionId: string | null) => {
      if (sectionId) {
        toggleSectionExpanded(sectionId);
      }
    },
    [toggleSectionExpanded],
  );

  const handleSectionLongPress = useCallback((section: Section | null) => {
    if (section) {
      console.debug('[ShoppingListScreen] Section long pressed:', section.id);
      // TODO: Open section context menu for edit/delete
    }
  }, []);

  const handleAddItemToSection = useCallback((section: Section) => {
    console.debug('[ShoppingListScreen] Add item to section:', section.id, section.name);
    // TODO: Open smart input with section pre-selected
    // The smart input would receive: `@${listName}:${section.name}` prefix
  }, []);

  const shoppingItems = useMemo(
    () =>
      items
        .filter((item): item is ShoppingItem => item.type === 'shopping')
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [items],
  );

  const sections = useMemo(
    () => (listId ? (sectionsByListId[listId] ?? []) : []),
    [listId, sectionsByListId],
  );

  const totals = useMemo(() => calculateTotal(shoppingItems), [shoppingItems]);

  /** Group items by section and create flat list data */
  const listData = useMemo(() => {
    const result: ListItem[] = [];

    // Group items by sectionId
    const itemsBySectionId = new Map<string | null, ShoppingItem[]>();
    for (const item of shoppingItems) {
      const sectionId = item.sectionId ?? null;
      const existing = itemsBySectionId.get(sectionId) ?? [];
      existing.push(item);
      itemsBySectionId.set(sectionId, existing);
    }

    // Add sections with their items
    for (const section of sections) {
      const sectionItems = itemsBySectionId.get(section.id) ?? [];
      const isExpanded = expandedSections[section.id] !== false;

      result.push({
        type: 'section-header',
        section,
        itemCount: sectionItems.length,
      });

      if (isExpanded) {
        for (const item of sectionItems) {
          result.push({ type: 'item', item, sectionId: section.id });
        }
      }
    }

    // Add unsorted items (no sectionId)
    const unsortedItems = itemsBySectionId.get(null) ?? [];
    if (unsortedItems.length > 0 || sections.length > 0) {
      // Only show "Unsorted" header if there are sections
      if (sections.length > 0) {
        result.push({
          type: 'section-header',
          section: null,
          itemCount: unsortedItems.length,
        });
      }

      for (const item of unsortedItems) {
        result.push({ type: 'item', item, sectionId: null });
      }
    }

    // Add button to create new section
    result.push({ type: 'add-section-button' });

    return result;
  }, [shoppingItems, sections, expandedSections]);

  const renderListItem = useCallback(
    ({ item: listItem }: { item: ListItem }) => {
      switch (listItem.type) {
        case 'section-header': {
          const isExpanded =
            listItem.section === null || expandedSections[listItem.section.id] !== false;
          return (
            <View style={styles.sectionHeaderContainer}>
              <SectionHeader
                name={listItem.section?.name ?? t('sections.unsorted', 'Sem seção')}
                itemCount={listItem.itemCount}
                expanded={isExpanded}
                onToggleExpand={
                  listItem.section
                    ? () => handleToggleSectionExpand(listItem.section?.id ?? null)
                    : undefined
                }
                onLongPress={() => handleSectionLongPress(listItem.section)}
                showAddButton={listItem.section !== null}
                onAddItem={
                  listItem.section
                    ? () => handleAddItemToSection(listItem.section as Section)
                    : undefined
                }
                testID={`section-header-${listItem.section?.id ?? 'unsorted'}`}
              />
            </View>
          );
        }
        case 'item':
          return (
            <View style={styles.itemContainer}>
              <ShoppingItemCard
                item={listItem.item}
                onToggle={handleItemToggle}
                onPress={handleItemPress}
                onLongPress={handleItemLongPress}
                showDragHandle={isReorderMode}
                testID={`shopping-item-${listItem.item.id}`}
              />
            </View>
          );
        case 'add-section-button':
          return (
            <View style={styles.addSectionContainer}>
              <SectionAddButton onPress={handleAddSection} testID="add-section-button" />
            </View>
          );
        default:
          return null;
      }
    },
    [
      expandedSections,
      handleToggleSectionExpand,
      handleSectionLongPress,
      handleAddItemToSection,
      handleItemToggle,
      handleItemPress,
      handleItemLongPress,
      handleAddSection,
      isReorderMode,
      styles.sectionHeaderContainer,
      styles.itemContainer,
      styles.addSectionContainer,
      t,
    ],
  );

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    switch (item.type) {
      case 'section-header':
        return `section-${item.section?.id ?? 'unsorted'}`;
      case 'item':
        return `item-${item.item.id}`;
      case 'add-section-button':
        return 'add-section-button';
      default:
        return `unknown-${index}`;
    }
  }, []);

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
        icon: History,
        onPress: handleViewHistory,
        label: t('shopping.viewHistory', 'Ver histórico'),
      },
      {
        icon: GripVertical,
        onPress: handleToggleReorderMode,
        label: t('shopping.reorder', 'Reordenar'),
        variant: isReorderMode ? 'accent' : 'ghost',
        isActive: isReorderMode,
      },
    ],
    [handleViewHistory, handleToggleReorderMode, isReorderMode, t],
  );

  return (
    <View style={styles.container}>
      <Navbar title={listName} leftAction={leftAction} rightActions={rightActions} />

      {!isLoading && shoppingItems.length === 0 && sections.length === 0 ? (
        <View style={styles.emptyContainer}>{emptyContent}</View>
      ) : (
        <FlatList
          data={listData}
          renderItem={renderListItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={emptyContent}
        />
      )}

      <View style={styles.bottomBarContainer}>
        <TotalBar
          total={totals.total}
          checkedCount={totals.checkedCount}
          totalCount={totals.totalCount}
          itemsWithoutPrice={totals.itemsWithoutPrice}
          testID="shopping-total-bar"
        />
        {totals.checkedCount > 0 && (
          <View style={styles.completeButtonContainer}>
            <CompleteButton
              onPress={handleCompletePurchasePress}
              total={totals.total}
              checkedCount={totals.checkedCount}
              isLoading={isCompletingPurchase}
              testID="shopping-complete-button"
            />
          </View>
        )}
      </View>

      <View style={styles.fabContainer}>
        <FAB
          icon={Plus}
          onPress={handleAddItem}
          accessibilityLabel={t('shopping.addItem', 'Adicionar Item')}
          testID="shopping-add-fab"
        />
      </View>

      {/* Edit Modal */}
      <EditModal
        visible={editModalVisible}
        item={editingItem}
        onClose={handleEditModalClose}
        onSubmit={handleEditSubmit}
        onDelete={handleDeleteRequest}
        testID="shopping-edit-modal"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        visible={deleteDialogVisible}
        title={t('shopping.deleteItem.title', 'Excluir item?')}
        description={t(
          'shopping.deleteItem.message',
          'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
        )}
        confirmButton={{
          label: t('common.delete', 'Excluir'),
          destructive: true,
        }}
        cancelButton={{
          label: t('common.cancel', 'Cancelar'),
        }}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        testID="shopping-delete-dialog"
      />

      {/* Complete Purchase Confirmation Dialog */}
      <ConfirmationDialog
        visible={completeDialogVisible}
        title={t('shopping.completePurchase.title', 'Concluir compra?')}
        description={t(
          'shopping.completePurchase.message',
          'Os itens marcados serão salvos no histórico e desmarcados da lista.',
        )}
        confirmButton={{
          label: t('shopping.completePurchase.confirm', 'Concluir'),
        }}
        cancelButton={{
          label: t('common.cancel', 'Cancelar'),
        }}
        onConfirm={handleCompletePurchaseConfirm}
        onCancel={handleCompletePurchaseCancel}
        testID="shopping-complete-dialog"
      />
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
      paddingBottom: 200,
    },
    sectionHeaderContainer: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    itemContainer: {
      marginVertical: theme.spacing.xs,
    },
    addSectionContainer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
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
      bottom: 160,
    },
    bottomBarContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    completeButtonContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
  });
