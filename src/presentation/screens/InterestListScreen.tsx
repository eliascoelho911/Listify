/**
 * InterestListScreen Presentation Component
 *
 * Displays a list of media items (movies, books, or games) with cover images,
 * metadata from external providers (TMDb, Google Books, IGDB), and checked state.
 * Supports marking items as watched/read/played.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';

import { useAppDependencies } from '@app/di';
import type { BookItem, GameItem, Item, MovieItem } from '@domain/item';
import type { ListType } from '@domain/list';
import { useItemStoreWithDI } from '@presentation/hooks';
import { FAB } from '@design-system/atoms';
import {
  ConfirmationDialog,
  EmptyState,
  MediaCard,
} from '@design-system/molecules';
import type { MediaItem } from '@design-system/molecules';
import type { NavbarAction } from '@design-system/organisms';
import { Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

type InterestItem = MovieItem | BookItem | GameItem;
type InterestItemType = 'movie' | 'book' | 'game';

interface InterestTypeConfig {
  listType: ListType;
  emptyTitle: string;
  emptySubtitle: string;
  checkedLabel: string;
  uncheckLabel: string;
}

const INTEREST_CONFIG: Record<InterestItemType, InterestTypeConfig> = {
  movie: {
    listType: 'movies',
    emptyTitle: 'interest.movie.empty.title',
    emptySubtitle: 'interest.movie.empty.description',
    checkedLabel: 'interest.movie.markWatched',
    uncheckLabel: 'interest.movie.markUnwatched',
  },
  book: {
    listType: 'books',
    emptyTitle: 'interest.book.empty.title',
    emptySubtitle: 'interest.book.empty.description',
    checkedLabel: 'interest.book.markRead',
    uncheckLabel: 'interest.book.markUnread',
  },
  game: {
    listType: 'games',
    emptyTitle: 'interest.game.empty.title',
    emptySubtitle: 'interest.game.empty.description',
    checkedLabel: 'interest.game.markPlayed',
    uncheckLabel: 'interest.game.markUnplayed',
  },
};

function getItemType(listType: ListType): InterestItemType | null {
  switch (listType) {
    case 'movies':
      return 'movie';
    case 'books':
      return 'book';
    case 'games':
      return 'game';
    default:
      return null;
  }
}

export function InterestListScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { id: listId } = useLocalSearchParams<{ id: string }>();
  const styles = createStyles(theme, insets.top);

  const { listRepository } = useAppDependencies();
  const itemStore = useItemStoreWithDI();
  const { items, isLoading, loadByListId, clearItems, toggleChecked, deleteItem } = itemStore();

  const [listName, setListName] = useState<string>('');
  const [listType, setListType] = useState<ListType | null>(null);
  const [itemType, setItemType] = useState<InterestItemType | null>(null);

  // Delete confirmation dialog state
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  useEffect(() => {
    if (listId) {
      listRepository.getById(listId).then((list) => {
        if (list) {
          setListName(list.name);
          setListType(list.listType);
          const type = getItemType(list.listType);
          setItemType(type);
          if (type) {
            loadByListId(listId, type);
          }
        }
      });
    }
    return () => {
      clearItems();
    };
  }, [listId, loadByListId, clearItems, listRepository]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleItemToggle = useCallback(
    async (item: MediaItem, checked: boolean) => {
      console.debug('[InterestListScreen] Toggle item:', item.id, checked);
      if (itemType) {
        await toggleChecked(item.id, itemType);
      }
    },
    [itemType, toggleChecked],
  );

  const handleItemPress = useCallback((item: MediaItem) => {
    console.debug('[InterestListScreen] Item pressed:', item.id);
    // TODO: Open detail view or edit modal
  }, []);

  const handleItemLongPress = useCallback((item: MediaItem) => {
    console.debug('[InterestListScreen] Item long pressed:', item.id);
    setItemToDelete(item as Item);
    setDeleteDialogVisible(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!itemToDelete || !itemType) return;

    console.debug('[InterestListScreen] Delete confirmed:', itemToDelete.id);
    await deleteItem(itemToDelete.id, itemType);

    setDeleteDialogVisible(false);
    setItemToDelete(null);
  }, [itemToDelete, itemType, deleteItem]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogVisible(false);
    setItemToDelete(null);
  }, []);

  const handleAddItem = useCallback(() => {
    console.debug('[InterestListScreen] Add item');
    // TODO: Open add item modal with media search
  }, []);

  const interestItems = useMemo(
    () =>
      items
        .filter((item): item is InterestItem =>
          ['movie', 'book', 'game'].includes(item.type),
        )
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [items],
  );

  const config = itemType ? INTEREST_CONFIG[itemType] : null;

  const renderItem = useCallback(
    ({ item }: { item: InterestItem }) => (
      <View style={styles.itemContainer}>
        <MediaCard
          item={item as MediaItem}
          onPress={handleItemPress}
          onLongPress={handleItemLongPress}
          onToggleChecked={handleItemToggle}
          showCheckbox
          showRating
          showYear
          testID={`media-item-${item.id}`}
        />
      </View>
    ),
    [handleItemPress, handleItemLongPress, handleItemToggle, styles.itemContainer],
  );

  const keyExtractor = useCallback((item: InterestItem) => item.id, []);

  const emptyContent = config ? (
    <EmptyState
      icon={Plus}
      title={t(config.emptyTitle, 'Lista vazia')}
      subtitle={t(config.emptySubtitle, 'Adicione itens usando o botão +')}
    />
  ) : null;

  const leftAction: NavbarAction = useMemo(
    () => ({
      icon: ArrowLeft,
      onPress: handleBackPress,
      label: t('common.back', 'Voltar'),
    }),
    [handleBackPress, t],
  );

  return (
    <View style={styles.container}>
      <Navbar title={listName} leftAction={leftAction} />

      {!isLoading && interestItems.length === 0 ? (
        <View style={styles.emptyContainer}>{emptyContent}</View>
      ) : (
        <FlatList
          data={interestItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={emptyContent}
        />
      )}

      <View style={styles.fabContainer}>
        <FAB
          icon={Plus}
          onPress={handleAddItem}
          accessibilityLabel={t('interest.addItem', 'Adicionar Item')}
          testID="interest-add-fab"
        />
      </View>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        visible={deleteDialogVisible}
        title={t('interest.deleteItem.title', 'Excluir item?')}
        description={t(
          'interest.deleteItem.message',
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
        testID="interest-delete-dialog"
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
      paddingBottom: 100,
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
      bottom: theme.spacing.xl,
    },
  });
