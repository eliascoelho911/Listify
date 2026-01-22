/**
 * ListsScreen Presentation Component
 *
 * Displays all user lists grouped by category (Notes, Shopping, Movies, Books, Games).
 * Uses CategoryDropdown organisms for each list type.
 * Includes FAB for creating new lists via modal form.
 * Supports editing and deleting lists via long-press context menu.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Edit2, FolderOpen, Plus, Settings, Trash2 } from 'lucide-react-native';

import type { List, ListType } from '@domain/list';
import { useListStoreWithDI } from '@presentation/hooks';
import { FAB } from '@design-system/atoms';
import {
  ConfirmationDialog,
  ContextMenu,
  type ContextMenuItem,
  EmptyState,
} from '@design-system/molecules';
import { CategoryDropdown, ListForm, type ListFormData, Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

const CATEGORY_ORDER: ListType[] = ['notes', 'shopping', 'movies', 'books', 'games'];

interface ContextMenuState {
  visible: boolean;
  list: List | null;
}

interface DeleteDialogState {
  visible: boolean;
  list: List | null;
  isDeleting: boolean;
}

interface EditModalState {
  visible: boolean;
  list: List | null;
  isUpdating: boolean;
  error: string | null;
}

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
    updateList,
    deleteList,
    error,
    clearError,
  } = listStore();

  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    list: null,
  });

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    visible: false,
    list: null,
    isDeleting: false,
  });

  // Edit modal state
  const [editModal, setEditModal] = useState<EditModalState>({
    visible: false,
    list: null,
    isUpdating: false,
    error: null,
  });

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
    // Don't show context menu for prefabricated (Notes) list
    if (list.isPrefabricated) {
      console.debug('[ListsScreen] Ignoring long press on prefabricated list');
      return;
    }
    setContextMenu({ visible: true, list });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu({ visible: false, list: null });
  }, []);

  const handleContextMenuSelect = useCallback(
    (item: ContextMenuItem) => {
      const selectedList = contextMenu.list;
      if (!selectedList) return;

      handleCloseContextMenu();

      if (item.id === 'edit') {
        setEditModal({
          visible: true,
          list: selectedList,
          isUpdating: false,
          error: null,
        });
      } else if (item.id === 'delete') {
        setDeleteDialog({
          visible: true,
          list: selectedList,
          isDeleting: false,
        });
      }
    },
    [contextMenu.list, handleCloseContextMenu],
  );

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        id: 'edit',
        label: t('lists.contextMenu.edit', 'Editar'),
        icon: Edit2,
      },
      {
        id: 'delete',
        label: t('lists.contextMenu.delete', 'Excluir'),
        icon: Trash2,
        destructive: true,
      },
    ],
    [t],
  );

  // Delete dialog handlers
  const handleCloseDeleteDialog = useCallback(() => {
    if (!deleteDialog.isDeleting) {
      setDeleteDialog({ visible: false, list: null, isDeleting: false });
    }
  }, [deleteDialog.isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    const listToDelete = deleteDialog.list;
    if (!listToDelete) return;

    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));

    const success = await deleteList(listToDelete.id);

    if (success) {
      console.debug('[ListsScreen] List deleted:', listToDelete.id);
    } else {
      console.error('[ListsScreen] Failed to delete list:', listToDelete.id);
    }

    setDeleteDialog({ visible: false, list: null, isDeleting: false });
  }, [deleteDialog.list, deleteList]);

  // Edit modal handlers
  const handleCloseEditModal = useCallback(() => {
    if (!editModal.isUpdating) {
      setEditModal({ visible: false, list: null, isUpdating: false, error: null });
    }
  }, [editModal.isUpdating]);

  const handleUpdateList = useCallback(
    async (data: ListFormData) => {
      const listToUpdate = editModal.list;
      if (!listToUpdate) return;

      setEditModal((prev) => ({ ...prev, isUpdating: true, error: null }));

      // Check for duplicate name within same type (excluding current list)
      const duplicateExists = lists.some(
        (list) =>
          list.id !== listToUpdate.id &&
          list.listType === listToUpdate.listType &&
          list.name.toLowerCase() === data.name.toLowerCase(),
      );

      if (duplicateExists) {
        setEditModal((prev) => ({
          ...prev,
          isUpdating: false,
          error: t('listForm.duplicateName'),
        }));
        return;
      }

      const result = await updateList(listToUpdate.id, { name: data.name });

      if (result) {
        console.debug('[ListsScreen] List updated:', result.id);
        setEditModal({ visible: false, list: null, isUpdating: false, error: null });
      } else {
        setEditModal((prev) => ({
          ...prev,
          isUpdating: false,
          error: error ?? t('lists.updateError', 'Erro ao atualizar lista'),
        }));
      }
    },
    [editModal.list, lists, t, updateList, error],
  );

  // Create modal handlers
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

  // Get item count for delete confirmation message
  const deleteItemCount = deleteDialog.list ? (itemCounts[deleteDialog.list.id] ?? 0) : 0;

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

      {/* Context Menu for list actions */}
      <ContextMenu
        visible={contextMenu.visible}
        items={contextMenuItems}
        onClose={handleCloseContextMenu}
        onSelect={handleContextMenuSelect}
        title={contextMenu.list?.name}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        visible={deleteDialog.visible}
        title={t('lists.deleteDialog.title', 'Excluir Lista')}
        description={
          deleteItemCount > 0
            ? t(
                'lists.deleteDialog.descriptionWithItems',
                'Tem certeza que deseja excluir "{{name}}"? Esta lista possui {{count}} itens que também serão excluídos.',
                { name: deleteDialog.list?.name, count: deleteItemCount },
              )
            : t(
                'lists.deleteDialog.description',
                'Tem certeza que deseja excluir "{{name}}"? Esta ação não pode ser desfeita.',
                { name: deleteDialog.list?.name },
              )
        }
        confirmButton={{
          label: t('lists.deleteDialog.confirm', 'Excluir'),
          destructive: true,
        }}
        cancelButton={{
          label: t('lists.deleteDialog.cancel', 'Cancelar'),
        }}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        isLoading={deleteDialog.isDeleting}
        testID="delete-list-dialog"
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

      {/* Edit List Modal */}
      <Modal
        visible={editModal.visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseEditModal}
      >
        <View style={styles.modalContainer}>
          <Navbar title={t('lists.editTitle', 'Editar Lista')} variant="modal" />
          <ListForm
            initialData={
              editModal.list
                ? {
                    name: editModal.list.name,
                    listType: editModal.list.listType,
                  }
                : undefined
            }
            onSubmit={handleUpdateList}
            onCancel={handleCloseEditModal}
            isLoading={editModal.isUpdating}
            error={editModal.error}
            disableTypeSelection={true}
            testID="edit-list-form"
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
