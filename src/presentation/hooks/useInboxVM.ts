/**
 * Inbox View Model Hook
 *
 * Provides a clean interface for the inbox screen to interact with the store.
 */

import { useCallback, useMemo } from 'react';
import { useStore } from 'zustand';

import type { Tag, UserInput } from '@domain/inbox/entities';

import { useInboxStoreContext } from '../state/inbox/InboxStoreProvider';

export type UseInboxVMReturn = {
  /** List of user inputs */
  inputs: UserInput[];

  /** Current input text */
  inputText: string;

  /** Whether a submission is in progress */
  isSubmitting: boolean;

  /** Whether inputs are being loaded */
  isLoading: boolean;

  /** Last error that occurred */
  lastError: Error | null;

  /** Tag suggestions for autocomplete */
  tagSuggestions: Tag[];

  /** Whether tag suggestions are loading */
  isLoadingTags: boolean;

  /** Whether there are more inputs to load */
  hasMore: boolean;

  /** Total number of inputs */
  total: number;

  /** Input being edited (null if not editing) */
  editingInput: UserInput | null;

  /** Whether currently in editing mode */
  isEditing: boolean;

  /** Set the input text */
  setInputText: (text: string) => void;

  /** Submit the current input */
  handleSubmit: () => Promise<void>;

  /** Load more inputs */
  handleLoadMore: () => Promise<void>;

  /** Refresh inputs (reload from beginning) */
  handleRefresh: () => Promise<void>;

  /** Search tags for autocomplete */
  handleSearchTags: (query: string) => Promise<void>;

  /** Clear tag suggestions */
  handleClearTagSuggestions: () => void;

  /** Clear last error */
  handleClearError: () => void;

  /** Start editing an input */
  handleStartEditing: (input: UserInput) => void;

  /** Cancel editing */
  handleCancelEditing: () => void;

  /** Delete an input */
  handleDelete: (id: string) => Promise<void>;

  /** Select a tag suggestion (insert into text) */
  handleSelectTag: (tag: Tag) => void;
};

/**
 * View model hook for the inbox screen.
 *
 * Provides derived state and action handlers for the UI.
 */
export function useInboxVM(): UseInboxVMReturn {
  const { store, repository } = useInboxStoreContext();

  const inputs = useStore(store, (state) => state.inputs);
  const inputText = useStore(store, (state) => state.inputText);
  const isSubmitting = useStore(store, (state) => state.isSubmitting);
  const isLoading = useStore(store, (state) => state.isLoading);
  const lastError = useStore(store, (state) => state.lastError);
  const tagSuggestions = useStore(store, (state) => state.tagSuggestions);
  const isLoadingTags = useStore(store, (state) => state.isLoadingTags);
  const hasMore = useStore(store, (state) => state.hasMore);
  const total = useStore(store, (state) => state.total);
  const editingInput = useStore(store, (state) => state.editingInput);

  const setInputText = useStore(store, (state) => state.setInputText);
  const submitInput = useStore(store, (state) => state.submitInput);
  const loadInputs = useStore(store, (state) => state.loadInputs);
  const loadMore = useStore(store, (state) => state.loadMore);
  const searchTags = useStore(store, (state) => state.searchTags);
  const clearTagSuggestions = useStore(store, (state) => state.clearTagSuggestions);
  const clearError = useStore(store, (state) => state.clearError);
  const startEditing = useStore(store, (state) => state.startEditing);
  const cancelEditing = useStore(store, (state) => state.cancelEditing);
  const deleteInput = useStore(store, (state) => state.deleteInput);

  const handleSubmit = useCallback(async () => {
    await submitInput(repository);
  }, [submitInput, repository]);

  const handleLoadMore = useCallback(async () => {
    await loadMore(repository);
  }, [loadMore, repository]);

  const handleRefresh = useCallback(async () => {
    await loadInputs(repository, 0);
  }, [loadInputs, repository]);

  const handleSearchTags = useCallback(
    async (query: string) => {
      await searchTags(repository, query);
    },
    [searchTags, repository],
  );

  const handleClearTagSuggestions = useCallback(() => {
    clearTagSuggestions();
  }, [clearTagSuggestions]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  const handleStartEditing = useCallback(
    (input: UserInput) => {
      startEditing(input);
    },
    [startEditing],
  );

  const handleCancelEditing = useCallback(() => {
    cancelEditing();
  }, [cancelEditing]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteInput(repository, id);
    },
    [deleteInput, repository],
  );

  const handleSelectTag = useCallback(
    (tag: Tag) => {
      const currentText = store.getState().inputText;
      const hashIndex = currentText.lastIndexOf('#');

      if (hashIndex >= 0) {
        const beforeHash = currentText.substring(0, hashIndex);
        const newText = `${beforeHash}#${tag.name} `;
        setInputText(newText);
      }

      clearTagSuggestions();
    },
    [store, setInputText, clearTagSuggestions],
  );

  const isEditing = useMemo(() => editingInput !== null, [editingInput]);

  return {
    inputs,
    inputText,
    isSubmitting,
    isLoading,
    lastError,
    tagSuggestions,
    isLoadingTags,
    hasMore,
    total,
    editingInput,
    isEditing,
    setInputText,
    handleSubmit,
    handleLoadMore,
    handleRefresh,
    handleSearchTags,
    handleClearTagSuggestions,
    handleClearError,
    handleStartEditing,
    handleCancelEditing,
    handleDelete,
    handleSelectTag,
  };
}
