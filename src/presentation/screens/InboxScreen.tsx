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
import { Inbox, Settings } from 'lucide-react-native';

import type { Item } from '@domain/item';
import { useItemStoreWithDI } from '@presentation/hooks';
import { GroupHeader } from '@design-system/atoms';
import {
  EmptyState,
  ItemCard,
  type SortDirection,
  SortingControls,
  type SortOption,
} from '@design-system/molecules';
import { type InfiniteScrollGroup, InfiniteScrollList, Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

type GroupBy = 'date' | 'type' | 'list';

const SORT_OPTIONS: SortOption<GroupBy>[] = [
  { value: 'date', label: 'Data' },
  { value: 'type', label: 'Tipo' },
];

function formatDateGroup(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (itemDate.getTime() === today.getTime()) {
    return 'Hoje';
  }
  if (itemDate.getTime() === yesterday.getTime()) {
    return 'Ontem';
  }

  const diff = today.getTime() - itemDate.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (days < 7) {
    return date.toLocaleDateString('pt-BR', { weekday: 'long' });
  }
  if (days < 30) {
    return `${Math.floor(days / 7)} semana${days >= 14 ? 's' : ''} atrás`;
  }
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function getItemTypeName(type: Item['type']): string {
  const typeNames: Record<Item['type'], string> = {
    note: 'Notas',
    shopping: 'Compras',
    movie: 'Filmes',
    book: 'Livros',
    game: 'Jogos',
  };
  return typeNames[type];
}

function groupItemsByDate(items: Item[], direction: SortDirection): InfiniteScrollGroup<Item>[] {
  const groups = new Map<string, Item[]>();

  for (const item of items) {
    const key = formatDateGroup(item.createdAt);
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

function groupItemsByType(items: Item[], direction: SortDirection): InfiniteScrollGroup<Item>[] {
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
      title: getItemTypeName(type as Item['type']),
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
  const { t } = useTranslation();
  const styles = createStyles(theme, insets.top);

  const [groupBy, setGroupBy] = useState<GroupBy>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const itemStore = useItemStoreWithDI();
  const { items, isLoading, loadInboxItems, clearItems } = itemStore();

  useEffect(() => {
    loadInboxItems();
    return () => clearItems();
  }, [loadInboxItems, clearItems]);

  const groups = useMemo(() => {
    if (items.length === 0) return [];

    switch (groupBy) {
      case 'date':
        return groupItemsByDate(items, sortDirection);
      case 'type':
        return groupItemsByType(items, sortDirection);
      default:
        return groupItemsByDate(items, sortDirection);
    }
  }, [items, groupBy, sortDirection]);

  const handleGroupByChange = useCallback((value: GroupBy) => {
    setGroupBy(value);
  }, []);

  const handleDirectionToggle = useCallback(() => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const handleRefresh = useCallback(async () => {
    await loadInboxItems();
  }, [loadInboxItems]);

  const handleItemPress = useCallback((item: Item) => {
    console.debug('[InboxScreen] Item pressed:', item.id);
  }, []);

  const handleItemLongPress = useCallback((item: Item) => {
    console.debug('[InboxScreen] Item long pressed:', item.id);
  }, []);

  const handleSettingsPress = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const renderItem = useCallback(
    (item: Item) => (
      <ItemCard
        item={item}
        showListBadge={false}
        onPress={handleItemPress}
        onLongPress={handleItemLongPress}
      />
    ),
    [handleItemPress, handleItemLongPress],
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
        options={SORT_OPTIONS}
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
