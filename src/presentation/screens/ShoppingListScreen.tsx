/**
 * ShoppingListScreen Presentation Component
 *
 * Displays a shopping list with items that can be checked off.
 * Shows a TotalBar at the bottom with the sum of all checked item prices.
 * Supports real-time total calculation as items are toggled.
 * Supports drag and drop reordering of items.
 * Supports sections for organizing items.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, GripVertical, Plus } from 'lucide-react-native';

import { useAppDependencies } from '@app/di';
import type { ShoppingItem } from '@domain/item';
import type { Section } from '@domain/section';
import { useItemStoreWithDI, useSectionStoreWithDI } from '@presentation/hooks';
import { FAB, SectionAddButton } from '@design-system/atoms';
import { EmptyState, SectionHeader, ShoppingItemCard, TotalBar } from '@design-system/molecules';
import type { NavbarAction } from '@design-system/organisms';
import { Navbar } from '@design-system/organisms';
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
  const { items, isLoading, loadByListId, clearItems, toggleChecked } = itemStore();
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
      bottom: 80,
    },
  });
