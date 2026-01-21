/**
 * ListsScreen Presentation Component
 *
 * Displays all user lists grouped by category (Notes, Shopping, Movies, Books, Games).
 * Uses CategoryDropdown organisms for each list type.
 * Includes FAB for creating new lists via modal form.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FolderOpen, Plus, Settings } from 'lucide-react-native';

import type { List, ListType } from '@domain/list';
import { useListStoreWithDI } from '@presentation/hooks';
import { FAB } from '@design-system/atoms';
import { EmptyState } from '@design-system/molecules';
import { CategoryDropdown, ListForm, type ListFormData, Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

const CATEGORY_ORDER: ListType[] = ['notes', 'shopping', 'movies', 'books', 'games'];

export function ListsScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const styles = createStyles(theme, insets.top);

  const listStore = useListStoreWithDI();
  const {
    lists,
    isLoading,
    itemCounts,
    expandedCategories,
    loadLists,
    toggleCategory,
    clearLists,
    createList,
    error,
    clearError,
  } = listStore();

  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    loadLists();
    return () => clearLists();
  }, [loadLists, clearLists]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLists();
    setRefreshing(false);
  }, [loadLists]);

  const handleSettingsPress = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const handleListPress = useCallback(
    (list: List) => {
      console.debug('[ListsScreen] List pressed:', list.id);
      router.push(`/list/${list.id}`);
    },
    [router],
  );

  const handleListLongPress = useCallback((list: List) => {
    console.debug('[ListsScreen] List long pressed:', list.id);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setCreateError(null);
    clearError();
    setShowCreateModal(true);
  }, [clearError]);

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
    setCreateError(null);
  }, []);

  const handleCreateList = useCallback(
    async (data: ListFormData) => {
      setIsCreating(true);
      setCreateError(null);

      // Check for duplicate name within same type
      const duplicateExists = lists.some(
        (list) =>
          list.listType === data.listType && list.name.toLowerCase() === data.name.toLowerCase(),
      );

      if (duplicateExists) {
        setCreateError(t('listForm.duplicateName'));
        setIsCreating(false);
        return;
      }

      const result = await createList({
        name: data.name,
        listType: data.listType,
        isPrefabricated: false,
      });

      setIsCreating(false);

      if (result) {
        setShowCreateModal(false);
        console.debug('[ListsScreen] List created:', result.id);
      } else if (error) {
        setCreateError(error);
      }
    },
    [createList, lists, t, error],
  );

  const handleToggleCategory = useCallback(
    (category: ListType) => {
      toggleCategory(category);
    },
    [toggleCategory],
  );

  const listsByCategory = useMemo(() => {
    const grouped: Record<ListType, List[]> = {
      notes: [],
      shopping: [],
      movies: [],
      books: [],
      games: [],
    };

    for (const list of lists) {
      grouped[list.listType].push(list);
    }

    return grouped;
  }, [lists]);

  const hasAnyLists = lists.length > 0;

  const emptyContent = (
    <EmptyState
      icon={FolderOpen}
      title={t('lists.empty.title', 'Nenhuma lista')}
      subtitle={t('lists.empty.description', 'Crie uma lista usando o botão +')}
    />
  );

  return (
    <View style={styles.container}>
      <Navbar
        title={t('lists.title', 'Listas')}
        rightActions={[
          {
            icon: Settings,
            onPress: handleSettingsPress,
            label: t('settings.title', 'Configurações'),
          },
        ]}
      />

      {!isLoading && !hasAnyLists ? (
        <View style={styles.emptyContainer}>{emptyContent}</View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        >
          {CATEGORY_ORDER.map((category) => {
            const categoryLists = listsByCategory[category];

            return (
              <CategoryDropdown
                key={category}
                category={category}
                lists={categoryLists}
                itemCounts={itemCounts}
                expanded={expandedCategories[category]}
                onToggleExpand={() => handleToggleCategory(category)}
                onListPress={handleListPress}
                onListLongPress={handleListLongPress}
              />
            );
          })}
        </ScrollView>
      )}

      {/* FAB for creating new lists */}
      <FAB
        icon={Plus}
        onPress={handleOpenCreateModal}
        label={t('lists.createButton', 'Create List')}
        style={styles.fab}
        testID="lists-create-fab"
      />

      {/* Create List Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseCreateModal}
      >
        <View style={styles.modalContainer}>
          <Navbar title={t('lists.createTitle', 'Nova Lista')} variant="modal" />
          <ListForm
            onSubmit={handleCreateList}
            onCancel={handleCloseCreateModal}
            isLoading={isCreating}
            error={createError}
            testID="create-list-form"
          />
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (
  theme: { colors: { background: string }; spacing: { lg: number; xl: number } },
  topInset: number,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: topInset,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingVertical: theme.spacing.lg,
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
      bottom: theme.spacing.lg,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: topInset,
    },
  });
