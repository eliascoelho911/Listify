/**
 * NotesScreen Presentation Component
 *
 * Displays all note items grouped by date with sorting controls.
 * Uses the NoteCard molecule for consistent note display.
 * Supports drag-and-drop reordering in edit mode.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import type { TFunction } from 'i18next';
import { FileText, GripVertical, Settings } from 'lucide-react-native';

import type { NoteItem } from '@domain/item';
import { useItemStoreWithDI, useUserPreferencesStoreWithDI } from '@presentation/hooks';
import { useDragAndDrop } from '@presentation/hooks/useDragAndDrop';
import { DragHandle, GroupHeader } from '@design-system/atoms';
import {
  EmptyState,
  NoteCard,
  type SortDirection,
  SortingControls,
  type SortOption,
} from '@design-system/molecules';
import {
  DraggableList,
  type DraggableListRenderItemParams,
  type InfiniteScrollGroup,
  InfiniteScrollList,
  Navbar,
} from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

type GroupBy = 'date' | 'list';

function getSortOptions(t: TFunction): SortOption<GroupBy>[] {
  return [{ value: 'date', label: t('common.date', 'Data') }];
}

function formatDateGroup(date: Date, t: TFunction, locale: string): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (itemDate.getTime() === today.getTime()) {
    return t('common.today', 'Hoje');
  }
  if (itemDate.getTime() === yesterday.getTime()) {
    return t('common.yesterday', 'Ontem');
  }

  const diff = today.getTime() - itemDate.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (days < 7) {
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return t('common.weeksAgo', { count: weeks, defaultValue: '{{count}} semana atrás' });
  }
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

function groupNotesByDate(
  notes: NoteItem[],
  direction: SortDirection,
  t: TFunction,
  locale: string,
): InfiniteScrollGroup<NoteItem>[] {
  const groups = new Map<string, NoteItem[]>();

  for (const note of notes) {
    const key = formatDateGroup(note.createdAt, t, locale);
    const existing = groups.get(key) ?? [];
    existing.push(note);
    groups.set(key, existing);
  }

  const sortedGroups = Array.from(groups.entries()).map(([title, groupNotes]) => ({
    key: title,
    title,
    items: groupNotes.sort((a, b) => {
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      return direction === 'desc' ? bTime - aTime : aTime - bTime;
    }),
  }));

  return direction === 'desc' ? sortedGroups : sortedGroups.reverse();
}

export function NotesScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const styles = createStyles(theme, insets.top);

  const itemStore = useItemStoreWithDI();
  const { items, isLoading, loadAllNotes, clearItems, updateSortOrder } = itemStore();

  const preferencesStore = useUserPreferencesStoreWithDI();
  const { getLayoutConfig, setLayoutConfig } = preferencesStore();

  // Get layout config from preferences
  const layoutConfig = getLayoutConfig('notes');
  const [groupBy, setGroupBy] = useState<GroupBy>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>(layoutConfig.sortDirection);
  const [isReorderMode, setIsReorderMode] = useState(false);

  useEffect(() => {
    loadAllNotes();
    return () => clearItems();
  }, [loadAllNotes, clearItems]);

  // Filter only note items
  const notes = useMemo(() => {
    return items.filter((item): item is NoteItem => item.type === 'note');
  }, [items]);

  // Sort notes by sortOrder for drag and drop
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [notes]);

  // Drag and drop handler
  const handlePersistOrder = useCallback(
    async (reorderedNotes: NoteItem[]): Promise<void> => {
      await updateSortOrder(reorderedNotes, 'note');
    },
    [updateSortOrder],
  );

  const {
    items: draggableNotes,
    handleDragEnd,
    setItems: setDraggableNotes,
  } = useDragAndDrop<NoteItem>({
    initialItems: sortedNotes,
    onPersist: handlePersistOrder,
  });

  // Sync draggable items when notes change
  useEffect(() => {
    setDraggableNotes(sortedNotes);
  }, [sortedNotes, setDraggableNotes]);

  const sortOptions = useMemo(() => getSortOptions(t), [t]);

  const groups = useMemo(() => {
    if (notes.length === 0) return [];
    return groupNotesByDate(notes, sortDirection, t, i18n.language);
  }, [notes, sortDirection, t, i18n.language]);

  const handleGroupByChange = useCallback((value: GroupBy) => {
    setGroupBy(value);
  }, []);

  const handleDirectionToggle = useCallback(() => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    // Persist layout config
    setLayoutConfig('notes', { groupBy: 'createdAt', sortDirection: newDirection });
  }, [sortDirection, setLayoutConfig]);

  const handleRefresh = useCallback(async () => {
    await loadAllNotes();
  }, [loadAllNotes]);

  const handleNotePress = useCallback((note: NoteItem) => {
    console.debug('[NotesScreen] Note pressed:', note.id);
    // TODO: Navigate to note detail/edit screen when route is created
  }, []);

  const handleNoteLongPress = useCallback((note: NoteItem) => {
    console.debug('[NotesScreen] Note long pressed:', note.id);
    // TODO: Show context menu
  }, []);

  const handleSettingsPress = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const handleToggleReorderMode = useCallback(() => {
    setIsReorderMode((prev) => !prev);
  }, []);

  // Render item for normal mode (grouped list)
  const renderItem = useCallback(
    (note: NoteItem) => (
      <NoteCard note={note} onPress={handleNotePress} onLongPress={handleNoteLongPress} />
    ),
    [handleNotePress, handleNoteLongPress],
  );

  // Render item for reorder mode (draggable list)
  const renderDraggableItem = useCallback(
    ({ item, drag, isActive }: DraggableListRenderItemParams<NoteItem>) => (
      <View style={[styles.draggableItemContainer, isActive && styles.draggableItemActive]}>
        <Pressable onPressIn={drag} style={styles.dragHandleContainer}>
          <DragHandle size="md" isDragging={isActive} />
        </Pressable>
        <View style={styles.draggableItemContent}>
          <NoteCard note={item} onPress={handleNotePress} onLongPress={handleNoteLongPress} />
        </View>
      </View>
    ),
    [handleNotePress, handleNoteLongPress, styles],
  );

  const renderGroupHeader = useCallback(
    (group: InfiniteScrollGroup<NoteItem>) => (
      <GroupHeader label={group.title} count={group.items.length} variant="date" />
    ),
    [],
  );

  const keyExtractor = useCallback((note: NoteItem) => note.id, []);

  const emptyContent = (
    <EmptyState
      icon={FileText}
      title={t('notes.empty.title', 'Nenhuma nota')}
      subtitle={t('notes.empty.description', 'Adicione notas usando o botão +')}
    />
  );

  // Navbar actions with reorder toggle
  const navbarActions = useMemo(
    () => [
      {
        icon: GripVertical,
        onPress: handleToggleReorderMode,
        label: isReorderMode
          ? t('notes.reorder.done', 'Concluir')
          : t('notes.reorder.start', 'Reordenar'),
      },
      {
        icon: Settings,
        onPress: handleSettingsPress,
        label: t('settings.title', 'Configurações'),
      },
    ],
    [handleToggleReorderMode, handleSettingsPress, isReorderMode, t],
  );

  return (
    <View style={styles.container}>
      <Navbar
        title={
          isReorderMode ? t('notes.reorder.title', 'Reordenar Notas') : t('notes.title', 'Notas')
        }
        rightActions={navbarActions}
      />

      {!isReorderMode && (
        <SortingControls
          options={sortOptions}
          selectedValue={groupBy}
          sortDirection={sortDirection}
          onSortChange={handleGroupByChange}
          onDirectionToggle={handleDirectionToggle}
          label={t('notes.groupBy', 'Agrupar por')}
        />
      )}

      {isReorderMode ? (
        <DraggableList<NoteItem>
          data={draggableNotes}
          renderItem={renderDraggableItem}
          onDragEnd={handleDragEnd}
          keyExtractor={keyExtractor}
          isReorderEnabled
          style={styles.list}
          ListEmptyComponent={emptyContent}
        />
      ) : (
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
      )}
    </View>
  );
}

const createStyles = (
  theme: {
    colors: { background: string; card: string; primary: string };
    spacing: { sm: number; md: number; lg: number };
    radii: { md: number };
  },
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
    draggableItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm / 2,
    },
    draggableItemActive: {
      opacity: 0.9,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.md,
    },
    dragHandleContainer: {
      paddingRight: theme.spacing.sm,
      paddingVertical: theme.spacing.md,
    },
    draggableItemContent: {
      flex: 1,
    },
  });
