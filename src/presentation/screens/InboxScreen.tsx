/**
 * InboxScreen Presentation Component
 *
 * Hub central for all items without a list assignment.
 * Shows items grouped by date with sorting controls.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Inbox, Settings, Trash2 } from 'lucide-react-native';

import type { Item } from '@domain/item';
import { useItemStoreWithDI } from '@presentation/hooks';
import { GroupHeader } from '@design-system/atoms';
import {
  ConfirmationDialog,
  ContextMenu,
  type ContextMenuItem,
  EmptyState,
  ItemCard,
  type SortDirection,
  SortingControls,
  type SortOption,
  SwipeToDelete,
} from '@design-system/molecules';
import { type InfiniteScrollGroup, InfiniteScrollList, Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

type GroupBy = 'date' | 'type' | 'list';

function formatDateGroup(
  date: Date,
  t: (key: string, options?: Record<string, unknown>) => string,
  locale: string,
): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (itemDate.getTime() === today.getTime()) {
    return t('inbox.dateGroups.today', { defaultValue: 'Today' });
  }
  if (itemDate.getTime() === yesterday.getTime()) {
    return t('inbox.dateGroups.yesterday', { defaultValue: 'Yesterday' });
  }

  const diff = today.getTime() - itemDate.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (days < 7) {
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return t('inbox.dateGroups.weeksAgo', { count: weeks, defaultValue: `${weeks} week(s) ago` });
  }
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

function getItemTypeName(
  type: Item['type'],
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  const typeKeys: Record<Item['type'], string> = {
    note: 'listTypes.notes',
    shopping: 'listTypes.shopping',
    movie: 'listTypes.movies',
    book: 'listTypes.books',
    game: 'listTypes.games',
  };
  return t(typeKeys[type], { defaultValue: type });
}

function groupItemsByDate(
  items: Item[],
  direction: SortDirection,
  t: (key: string, options?: Record<string, unknown>) => string,
  locale: string,
): InfiniteScrollGroup<Item>[] {
  const groups = new Map<string, Item[]>();

  for (const item of items) {
    const key = formatDateGroup(item.createdAt, t, locale);
    const existing = groups.get(key) ?? [];
    existing.push(item);
    groups.set(key, existing);
  }

  const sortedGroups = Array.from(groups.entries()).map(([title, groupItems]) => ({
    key: title,
    title,
    items: groupItems.sort((a, b) => {
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      return direction === 'desc' ? bTime - aTime : aTime - bTime;
    }),
  }));

  return direction === 'desc' ? sortedGroups : sortedGroups.reverse();
}

function groupItemsByType(
  items: Item[],
  direction: SortDirection,
  t: (key: string, options?: Record<string, unknown>) => string,
): InfiniteScrollGroup<Item>[] {
  const groups = new Map<string, Item[]>();

  for (const item of items) {
    const key = item.type;
    const existing = groups.get(key) ?? [];
    existing.push(item);
    groups.set(key, existing);
  }

  const sortedGroups = Array.from(groups.entries())
    .map(([type, groupItems]) => ({
      key: type,
      title: getItemTypeName(type as Item['type'], t),
      items: groupItems.sort((a, b) => {
        const aTime = a.createdAt.getTime();
        const bTime = b.createdAt.getTime();
        return direction === 'desc' ? bTime - aTime : aTime - bTime;
      }),
    }))
    .sort((a, b) => {
      return direction === 'desc'
        ? b.items.length - a.items.length
        : a.items.length - b.items.length;
    });

  return sortedGroups;
}

export function InboxScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const styles = createStyles(theme, insets.top);
  const locale = i18n.language || 'en';

  const sortOptions: SortOption<GroupBy>[] = useMemo(
    () => [
      { value: 'date', label: t('inbox.sortOptions.date', 'Date') },
      { value: 'type', label: t('inbox.sortOptions.type', 'Type') },
    ],
    [t],
  );

  const [groupBy, setGroupBy] = useState<GroupBy>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Context menu state
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Delete confirmation state
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const itemStore = useItemStoreWithDI();
  const { items, isLoading, loadInboxItems, clearItems, deleteItem } = itemStore();

  useEffect(() => {
    loadInboxItems();
    return () => clearItems();
  }, [loadInboxItems, clearItems]);

  const groups = useMemo(() => {
    if (items.length === 0) return [];

    switch (groupBy) {
      case 'date':
        return groupItemsByDate(items, sortDirection, t, locale);
      case 'type':
        return groupItemsByType(items, sortDirection, t);
      default:
        return groupItemsByDate(items, sortDirection, t, locale);
    }
  }, [items, groupBy, sortDirection, t, locale]);

  const handleGroupByChange = useCallback((value: GroupBy) => {
    setGroupBy(value);
  }, []);

  const handleDirectionToggle = useCallback(() => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const handleRefresh = useCallback(async () => {
    await loadInboxItems();
  }, [loadInboxItems]);

  const handleItemPress = useCallback(
    (item: Item) => {
      console.debug('[InboxScreen] Item pressed:', item.id);
      // Navigate to item detail based on type
      if (item.type === 'note') {
        router.push(`/note/${item.id}`);
      }
    },
    [router],
  );

  const handleItemLongPress = useCallback((item: Item) => {
    console.debug('[InboxScreen] Item long pressed:', item.id);
    setSelectedItem(item);
    setContextMenuVisible(true);
  }, []);

  const handleContextMenuClose = useCallback(() => {
    setContextMenuVisible(false);
    setSelectedItem(null);
  }, []);

  const handleContextMenuSelect = useCallback(
    (menuItem: ContextMenuItem) => {
      if (menuItem.id === 'delete' && selectedItem) {
        setItemToDelete(selectedItem);
        setDeleteDialogVisible(true);
      }
      setContextMenuVisible(false);
    },
    [selectedItem],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!itemToDelete) return;

    console.debug('[InboxScreen] Delete confirmed:', itemToDelete.id);
    await deleteItem(itemToDelete.id, itemToDelete.type);

    setDeleteDialogVisible(false);
    setItemToDelete(null);
    setSelectedItem(null);
  }, [itemToDelete, deleteItem]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogVisible(false);
    setItemToDelete(null);
  }, []);

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        id: 'delete',
        label: t('common.delete', 'Excluir'),
        icon: Trash2,
        destructive: true,
      },
    ],
    [t],
  );

  const handleSettingsPress = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const handleSwipeDelete = useCallback((item: Item) => {
    // Set item for confirmation before actual deletion
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  }, []);

  const renderItem = useCallback(
    (item: Item) => (
      <SwipeToDelete
        onDelete={() => handleSwipeDelete(item)}
        deleteLabel={t('common.delete', 'Excluir')}
      >
        <ItemCard
          item={item}
          showListBadge={false}
          onPress={handleItemPress}
          onLongPress={handleItemLongPress}
        />
      </SwipeToDelete>
    ),
    [handleItemPress, handleItemLongPress, handleSwipeDelete, t],
  );

  const renderGroupHeader = useCallback(
    (group: InfiniteScrollGroup<Item>) => (
      <GroupHeader label={group.title} count={group.items.length} variant="date" />
    ),
    [],
  );

  const keyExtractor = useCallback((item: Item) => item.id, []);

  const emptyContent = (
    <EmptyState
      icon={Inbox}
      title={t('inbox.empty.title', 'Nenhum item')}
      subtitle={t('inbox.empty.description', 'Adicione itens usando o botão +')}
    />
  );

  return (
    <View style={styles.container}>
      <Navbar
        title={t('inbox.title', 'Inbox')}
        rightActions={[
          {
            icon: Settings,
            onPress: handleSettingsPress,
            label: t('settings.title', 'Configurações'),
          },
        ]}
      />

      <SortingControls
        options={sortOptions}
        selectedValue={groupBy}
        sortDirection={sortDirection}
        onSortChange={handleGroupByChange}
        onDirectionToggle={handleDirectionToggle}
        label={t('inbox.groupBy', 'Agrupar por')}
      />

      <InfiniteScrollList
        groups={groups}
        renderItem={renderItem}
        renderGroupHeader={renderGroupHeader}
        keyExtractor={keyExtractor}
        isLoading={isLoading}
        hasMore={false}
        onRefresh={handleRefresh}
        refreshing={isLoading}
        emptyContent={emptyContent}
        style={styles.list}
      />

      {/* Context Menu for item actions */}
      <ContextMenu
        visible={contextMenuVisible}
        items={contextMenuItems}
        title={selectedItem?.title}
        onClose={handleContextMenuClose}
        onSelect={handleContextMenuSelect}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        visible={deleteDialogVisible}
        title={t('inbox.deleteItem.title', 'Excluir item?')}
        description={t(
          'inbox.deleteItem.message',
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
        testID="inbox-delete-dialog"
      />
    </View>
  );
}

const createStyles = (
  theme: { colors: { background: string }; spacing: { lg: number } },
  topInset: number,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: topInset,
    },
    list: {
      flex: 1,
    },
  });
