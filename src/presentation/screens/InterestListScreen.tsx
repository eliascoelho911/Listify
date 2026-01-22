/**
 * InterestListScreen Presentation Component
 *
 * Displays a list of media items (movies, books, or games) with cover images,
 * metadata from external providers (TMDb, Google Books, IGDB), and checked state.
 * Supports marking items as watched/read/played.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';

import { useAppDependencies } from '@app/di';
import type { MediaProviderRepository } from '@domain/common';
import type {
  BookItem,
  BookMetadata,
  GameItem,
  GameMetadata,
  Item,
  MovieItem,
  MovieMetadata,
} from '@domain/item';
import type { ListType } from '@domain/list';
import { useItemStoreWithDI, useSmartInput } from '@presentation/hooks';
import { FAB } from '@design-system/atoms';
import type { MediaItem } from '@design-system/molecules';
import { ConfirmationDialog, EmptyState, MediaCard, SwipeToDelete } from '@design-system/molecules';
import type {
  MediaSearchResult,
  MediaType,
} from '@design-system/molecules/MediaSearchDropdown/MediaSearchDropdown.types';
import type { NavbarAction } from '@design-system/organisms';
import { Navbar, SmartInputModal } from '@design-system/organisms';
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

const SEARCH_DEBOUNCE_MS = 300;

export function InterestListScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { id: listId } = useLocalSearchParams<{ id: string }>();
  const styles = createStyles(theme, insets.top);

  const {
    listRepository,
    smartInputParser,
    categoryInference,
    movieProvider,
    bookProvider,
    gameProvider,
  } = useAppDependencies();
  const itemStore = useItemStoreWithDI();
  const { items, isLoading, loadByListId, clearItems, toggleChecked, deleteItem, createItem } =
    itemStore();

  const [listName, setListName] = useState<string>('');
  const [itemType, setItemType] = useState<InterestItemType | null>(null);

  // Delete confirmation dialog state
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  // Add item modal state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaSearchResults, setMediaSearchResults] = useState<MediaSearchResult[]>([]);
  const [isMediaSearchLoading, setIsMediaSearchLoading] = useState(false);
  const [mediaSearchError, setMediaSearchError] = useState<string | undefined>(undefined);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get the appropriate media provider based on item type
  const mediaProvider: MediaProviderRepository | null = useMemo(() => {
    switch (itemType) {
      case 'movie':
        return movieProvider;
      case 'book':
        return bookProvider;
      case 'game':
        return gameProvider;
      default:
        return null;
    }
  }, [itemType, movieProvider, bookProvider, gameProvider]);

  // Smart input hook for parsing (minimal use in media search mode)
  const smartInput = useSmartInput({
    parser: smartInputParser,
    categoryInference,
    mode: 'item',
    keepOpenAfterSubmit: true,
  });

  useEffect(() => {
    if (listId) {
      listRepository.getById(listId).then((list) => {
        if (list) {
          setListName(list.name);
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
    setAddModalVisible(true);
    setSearchQuery('');
    setMediaSearchResults([]);
    setMediaSearchError(undefined);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setAddModalVisible(false);
    setSearchQuery('');
    setMediaSearchResults([]);
    setMediaSearchError(undefined);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  // Debounced media search
  const handleSearchQueryChange = useCallback(
    (query: string) => {
      setSearchQuery(query);

      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Clear results if query is too short
      if (query.trim().length < 2 || !mediaProvider) {
        setMediaSearchResults([]);
        setIsMediaSearchLoading(false);
        return;
      }

      // Set loading state
      setIsMediaSearchLoading(true);
      setMediaSearchError(undefined);

      // Debounce the search
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await mediaProvider.search(query.trim());
          setMediaSearchResults(
            results.map((r) => ({
              externalId: r.externalId,
              title: r.title,
              description: r.description,
              imageUrl: r.imageUrl,
              year: r.year,
              metadata: r.metadata,
            })),
          );
          setMediaSearchError(undefined);
        } catch (error) {
          console.debug('[InterestListScreen] Media search error:', error);
          setMediaSearchError(t('interest.searchError', 'Erro ao buscar. Tente novamente.'));
          setMediaSearchResults([]);
        } finally {
          setIsMediaSearchLoading(false);
        }
      }, SEARCH_DEBOUNCE_MS);
    },
    [mediaProvider, t],
  );

  // Handle selection of a media search result
  const handleSelectMediaResult = useCallback(
    async (result: MediaSearchResult) => {
      if (!listId || !itemType) return;

      console.debug('[InterestListScreen] Selected media result:', result.title);

      // Create item based on type
      const baseInput = {
        listId,
        title: result.title,
        externalId: result.externalId,
        sortOrder: items.length,
        isChecked: false,
      };

      if (itemType === 'movie') {
        const metadata: MovieMetadata = {
          category: 'movie',
          coverUrl: result.imageUrl ?? undefined,
          description: result.description ?? undefined,
          releaseDate: result.year ? `${result.year}-01-01` : undefined,
          rating: (result.metadata.voteAverage as number) ?? undefined,
          cast: (result.metadata.cast as string[]) ?? undefined,
        };

        await createItem({ ...baseInput, type: 'movie', metadata }, 'movie');
      } else if (itemType === 'book') {
        const metadata: BookMetadata = {
          category: 'book',
          coverUrl: result.imageUrl ?? undefined,
          description: result.description ?? undefined,
          releaseDate: result.year ? `${result.year}-01-01` : undefined,
          rating: (result.metadata.averageRating as number) ?? undefined,
          authors: (result.metadata.authors as string[]) ?? undefined,
        };

        await createItem({ ...baseInput, type: 'book', metadata }, 'book');
      } else if (itemType === 'game') {
        const metadata: GameMetadata = {
          category: 'game',
          coverUrl: result.imageUrl ?? undefined,
          description: result.description ?? undefined,
          releaseDate: result.year ? `${result.year}-01-01` : undefined,
          rating: (result.metadata.rating as number) ?? undefined,
          developer: (result.metadata.developer as string) ?? undefined,
        };

        await createItem({ ...baseInput, type: 'game', metadata }, 'game');
      }

      // Keep modal open for continuous creation
      setSearchQuery('');
      setMediaSearchResults([]);
    },
    [listId, itemType, items.length, createItem],
  );

  // Handle manual entry (no API result selected)
  const handleManualMediaEntry = useCallback(
    async (title: string) => {
      if (!listId || !itemType || !title.trim()) return;

      console.debug('[InterestListScreen] Manual entry:', title);

      const baseInput = {
        listId,
        title: title.trim(),
        sortOrder: items.length,
        isChecked: false,
      };

      if (itemType === 'movie') {
        await createItem(
          { ...baseInput, type: 'movie', metadata: { category: 'movie' as const } },
          'movie',
        );
      } else if (itemType === 'book') {
        await createItem(
          { ...baseInput, type: 'book', metadata: { category: 'book' as const } },
          'book',
        );
      } else if (itemType === 'game') {
        await createItem(
          { ...baseInput, type: 'game', metadata: { category: 'game' as const } },
          'game',
        );
      }

      // Keep modal open for continuous creation
      setSearchQuery('');
      setMediaSearchResults([]);
    },
    [listId, itemType, items.length, createItem],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSwipeDelete = useCallback((item: Item) => {
    // Set item for confirmation before actual deletion
    setItemToDelete(item);
    setDeleteDialogVisible(true);
  }, []);

  const interestItems = useMemo(
    () =>
      items
        .filter((item): item is InterestItem => ['movie', 'book', 'game'].includes(item.type))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [items],
  );

  const config = itemType ? INTEREST_CONFIG[itemType] : null;

  const renderItem = useCallback(
    ({ item }: { item: InterestItem }) => (
      <View style={styles.itemContainer}>
        <SwipeToDelete
          onDelete={() => handleSwipeDelete(item)}
          deleteLabel={t('common.delete', 'Excluir')}
        >
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
        </SwipeToDelete>
      </View>
    ),
    [
      handleItemPress,
      handleItemLongPress,
      handleSwipeDelete,
      handleItemToggle,
      styles.itemContainer,
      t,
    ],
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

      {/* Add Item Modal with Media Search */}
      <SmartInputModal
        visible={addModalVisible}
        onClose={handleCloseAddModal}
        onSubmit={() => {}}
        value={searchQuery}
        onChangeText={handleSearchQueryChange}
        parsed={smartInput.parsed}
        listSuggestions={[]}
        showSuggestions={false}
        onSelectList={() => {}}
        placeholder={t(
          `interest.${itemType}.searchPlaceholder`,
          itemType === 'movie'
            ? 'Buscar filme...'
            : itemType === 'book'
              ? 'Buscar livro...'
              : 'Buscar jogo...',
        )}
        keepOpen
        mediaSearchMode={itemType as MediaType | undefined}
        mediaSearchResults={mediaSearchResults}
        isMediaSearchLoading={isMediaSearchLoading}
        mediaSearchError={mediaSearchError}
        onSelectMediaResult={handleSelectMediaResult}
        onManualMediaEntry={handleManualMediaEntry}
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
