/**
 * NoteDetailScreen Presentation Component
 *
 * Displays and edits a single note with:
 * - View mode as default (shows rendered markdown)
 * - Edit mode (shows markdown editor)
 * - Inline title editing
 * - Full markdown support (bold, italic, headers, lists, links, code)
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Edit3, Eye, Trash2 } from 'lucide-react-native';

import type { NoteItem, UpdateNoteItemInput } from '@domain/item';
import { useItemStoreWithDI } from '@presentation/hooks';
import { Button, IconButton, InlineEdit, Text } from '@design-system/atoms';
import { ConfirmationDialog, MarkdownEditor, MarkdownViewer } from '@design-system/molecules';
import { useTheme } from '@design-system/theme';

type ViewMode = 'view' | 'edit';

export function NoteDetailScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const styles = createStyles(theme, insets.top, insets.bottom);

  const itemStore = useItemStoreWithDI();
  const { items, isLoading, loadAllNotes, updateItem, deleteItem } = itemStore();

  const [mode, setMode] = useState<ViewMode>('view');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Find the note from loaded items
  const note = useMemo(() => {
    return items.find((item): item is NoteItem => item.id === id && item.type === 'note');
  }, [items, id]);

  // Load notes if not already loaded
  useEffect(() => {
    if (items.length === 0) {
      loadAllNotes();
    }
  }, [items.length, loadAllNotes]);

  // Initialize local state from note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description ?? '');
      setHasUnsavedChanges(false);
    }
  }, [note]);

  // Track unsaved changes
  useEffect(() => {
    if (note) {
      const titleChanged = title !== note.title;
      const descriptionChanged = (description || '') !== (note.description || '');
      setHasUnsavedChanges(titleChanged || descriptionChanged);
    }
  }, [title, description, note]);

  const handleBack = useCallback(() => {
    if (hasUnsavedChanges) {
      // Auto-save on back if there are changes
      handleSave();
    }
    router.back();
  }, [router, hasUnsavedChanges]);

  const handleToggleMode = useCallback(() => {
    if (mode === 'edit' && hasUnsavedChanges) {
      // Auto-save when switching from edit to view
      handleSave();
    }
    setMode((prev) => (prev === 'view' ? 'edit' : 'view'));
  }, [mode, hasUnsavedChanges]);

  const handleSave = useCallback(async () => {
    if (!note || !hasUnsavedChanges) return;

    const updates: UpdateNoteItemInput = {};
    if (title !== note.title) {
      updates.title = title;
    }
    if (description !== (note.description ?? '')) {
      updates.description = description || undefined;
    }

    if (Object.keys(updates).length > 0) {
      await updateItem(note.id, 'note', updates);
      setHasUnsavedChanges(false);
      console.debug('[NoteDetailScreen] Note saved:', note.id);
    }
  }, [note, title, description, hasUnsavedChanges, updateItem]);

  const handleTitleSubmit = useCallback(
    async (newTitle: string) => {
      if (!note) return;

      const trimmedTitle = newTitle.trim();
      if (trimmedTitle && trimmedTitle !== note.title) {
        await updateItem(note.id, 'note', { title: trimmedTitle });
        setTitle(trimmedTitle);
      } else {
        setTitle(note.title);
      }
    },
    [note, updateItem],
  );

  const handleDescriptionChange = useCallback((text: string) => {
    setDescription(text);
  }, []);

  const handleDelete = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!note) return;

    setShowDeleteDialog(false);
    const success = await deleteItem(note.id, 'note');
    if (success) {
      router.back();
    }
  }, [note, deleteItem, router]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  // Format last updated time
  const lastUpdated = useMemo(() => {
    if (!note) return '';
    const date = note.updatedAt;
    return date.toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [note, i18n.language]);

  // Loading state
  if (isLoading && !note) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="body" color="muted">
            {t('common.loading', 'Carregando...')}
          </Text>
        </View>
      </View>
    );
  }

  // Note not found
  if (!note) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon={ArrowLeft}
            onPress={() => router.back()}
            variant="ghost"
            size="md"
            accessibilityLabel={t('common.back', 'Voltar')}
          />
        </View>
        <View style={styles.notFoundContainer}>
          <Text variant="body" color="muted">
            {t('notes.notFound', 'Nota não encontrada')}
          </Text>
          <Button variant="outline" onPress={() => router.back()}>
            {t('common.goBack', 'Voltar')}
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={ArrowLeft}
          onPress={handleBack}
          variant="ghost"
          size="md"
          accessibilityLabel={t('common.back', 'Voltar')}
        />

        <View style={styles.headerActions}>
          <IconButton
            icon={mode === 'view' ? Edit3 : Eye}
            onPress={handleToggleMode}
            variant="ghost"
            size="md"
            accessibilityLabel={
              mode === 'view' ? t('notes.edit', 'Editar') : t('notes.view', 'Visualizar')
            }
          />
          <IconButton
            icon={Trash2}
            onPress={handleDelete}
            variant="ghost"
            size="md"
            accessibilityLabel={t('common.delete', 'Excluir')}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        {/* Title with inline edit */}
        <View style={styles.titleContainer}>
          <InlineEdit
            value={title}
            onChangeText={setTitle}
            onSubmit={handleTitleSubmit}
            isEditing={isTitleEditing}
            onEditingChange={setIsTitleEditing}
            variant="title"
            placeholder={t('notes.untitled', 'Sem título')}
            maxLength={200}
          />
        </View>

        {/* Last updated timestamp */}
        <View style={styles.metaContainer}>
          <Text variant="caption" color="muted">
            {t('notes.lastUpdated', 'Atualizado em {{date}}', { date: lastUpdated })}
          </Text>
          {hasUnsavedChanges && (
            <Text variant="caption" color="muted" style={styles.unsavedIndicator}>
              • {t('common.unsavedChanges', 'Alterações não salvas')}
            </Text>
          )}
        </View>

        {/* Content - View or Edit mode */}
        {mode === 'view' ? (
          <ScrollView
            style={styles.viewContainer}
            contentContainerStyle={styles.viewContent}
            showsVerticalScrollIndicator={false}
          >
            {description ? (
              <MarkdownViewer content={description} />
            ) : (
              <View style={styles.emptyContent}>
                <Text variant="body" color="muted" style={styles.emptyText}>
                  {t('notes.emptyNote', 'Toque no botão de editar para adicionar conteúdo')}
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <MarkdownEditor
            value={description}
            onChangeText={handleDescriptionChange}
            placeholder={t('notes.editorPlaceholder', 'Comece a escrever...')}
            style={styles.editor}
            minHeight={300}
            autoFocus
          />
        )}
      </KeyboardAvoidingView>

      {/* Save button in edit mode */}
      {mode === 'edit' && hasUnsavedChanges && (
        <View style={styles.saveButtonContainer}>
          <Button onPress={handleSave} variant="default">
            {t('common.save', 'Salvar')}
          </Button>
        </View>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmationDialog
        visible={showDeleteDialog}
        title={t('notes.deleteTitle', 'Excluir nota')}
        message={t(
          'notes.deleteMessage',
          'Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.',
        )}
        confirmLabel={t('common.delete', 'Excluir')}
        cancelLabel={t('common.cancel', 'Cancelar')}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="destructive"
      />
    </View>
  );
}

const createStyles = (
  theme: {
    colors: {
      background: string;
      card: string;
      border: string;
      primary: string;
      destructive: string;
      mutedForeground: string;
    };
    spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
    radii: { md: number };
  },
  topInset: number,
  bottomInset: number,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: topInset,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerActions: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    content: {
      flex: 1,
    },
    titleContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    metaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    unsavedIndicator: {
      color: theme.colors.primary,
    },
    viewContainer: {
      flex: 1,
    },
    viewContent: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    emptyContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl * 2,
    },
    emptyText: {
      textAlign: 'center',
      fontStyle: 'italic',
    },
    editor: {
      flex: 1,
    },
    saveButtonContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      paddingBottom: bottomInset + theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notFoundContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.xl,
    },
  });
