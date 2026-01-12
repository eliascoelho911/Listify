/**
 * Inbox View Model Hook (Reactive Version with Clean Architecture)
 *
 * Provides a clean interface for the inbox screen combining:
 * - useUserInputsPaginated for reactive data with pagination
 * - Zustand store for UI state (inputText, isSubmitting, etc.)
 * - UseCase hooks for business operations (with injected repository)
 */

import { useCallback, useMemo } from 'react';
import { useStore } from 'zustand';

import type { Tag, UserInput } from '@domain/inbox/entities';

import { useInboxUIStore } from '../state/inbox/InboxUIStoreProvider';
import {
  useCreateUserInput,
  useDeleteUserInput,
  useSearchTags,
  useUpdateUserInput,
} from './use-cases';
import { useUserInputsPaginated } from './useUserInputsPaginated';

export type UseInboxVMReturn = {
  /** List of user inputs (reactive for first 50, then on-demand) */
  inputs: UserInput[];

  /** Current input text */
  inputText: string;

  /** Whether a mutation is in progress */
  isSubmitting: boolean;

  /** Whether inputs are being loaded (initial load) */
  isLoading: boolean;

  /** Whether more inputs are being loaded (pagination) */
  isLoadingMore: boolean;

  /** Whether there are more inputs to load */
  hasMore: boolean;

  /** Last error that occurred */
  lastError: Error | null;

  /** Tag suggestions for autocomplete */
  tagSuggestions: Tag[];

  /** Whether tag suggestions are loading */
  isLoadingTags: boolean;

  /** Input being edited (null if not editing) */
  editingInput: UserInput | null;

  /** Whether currently in editing mode */
  isEditing: boolean;

  /** Set the input text */
  setInputText: (text: string) => void;

  /** Submit the current input (create or update) */
  handleSubmit: () => Promise<void>;

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

  /** Load more inputs (pagination) */
  handleLoadMore: () => Promise<void>;
};

/**
 * View model hook for the inbox screen (reactive version).
 *
 * Data comes from useUserInputsPaginated (reactive for first 50, then on-demand).
 * UI state is managed by the Zustand store.
 * Business operations go through UseCase hooks.
 */
export function useInboxVM(): UseInboxVMReturn {
  const store = useInboxUIStore();

  // UseCase hooks (with injected repository)
  const createInput = useCreateUserInput();
  const updateInput = useUpdateUserInput();
  const deleteInput = useDeleteUserInput();
  const searchTagsFn = useSearchTags();

  // Paginated data (reactive for first 50, then on-demand)
  const {
    inputs,
    isLoading: isLoadingInputs,
    isLoadingMore,
    hasMore,
    loadMore,
    error: paginatedError,
  } = useUserInputsPaginated();

  // UI state from Zustand store
  const inputText = useStore(store, (state) => state.inputText);
  const isSubmitting = useStore(store, (state) => state.isSubmitting);
  const lastError = useStore(store, (state) => state.lastError);
  const tagSuggestions = useStore(store, (state) => state.tagSuggestions);
  const isLoadingTags = useStore(store, (state) => state.isLoadingTags);
  const editingInput = useStore(store, (state) => state.editingInput);

  // UI actions from Zustand store
  const setInputText = useStore(store, (state) => state.setInputText);
  const setIsSubmitting = useStore(store, (state) => state.setIsSubmitting);
  const setError = useStore(store, (state) => state.setError);
  const clearError = useStore(store, (state) => state.clearError);
  const setTagSuggestions = useStore(store, (state) => state.setTagSuggestions);
  const setIsLoadingTags = useStore(store, (state) => state.setIsLoadingTags);
  const clearTagSuggestions = useStore(store, (state) => state.clearTagSuggestions);
  const startEditing = useStore(store, (state) => state.startEditing);
  const cancelEditing = useStore(store, (state) => state.cancelEditing);
  const resetAfterMutation = useStore(store, (state) => state.resetAfterMutation);

  // Combine errors from paginated query and UI
  const combinedError = useMemo(() => paginatedError ?? lastError, [paginatedError, lastError]);

  const handleSubmit = useCallback(async () => {
    const trimmedText = inputText.trim();
    if (trimmedText.length === 0) return;

    setIsSubmitting(true);
    clearError();

    try {
      if (editingInput) {
        await updateInput(editingInput.id, trimmedText);
      } else {
        await createInput({ text: trimmedText });
      }
      resetAfterMutation();
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to save input'));
      setIsSubmitting(false);
    }
  }, [
    inputText,
    editingInput,
    createInput,
    updateInput,
    setIsSubmitting,
    clearError,
    setError,
    resetAfterMutation,
  ]);

  const handleSearchTags = useCallback(
    async (query: string) => {
      if (query.length === 0) {
        clearTagSuggestions();
        return;
      }

      setIsLoadingTags(true);

      try {
        const tags = await searchTagsFn({ query, limit: 5 });
        setTagSuggestions(tags);
      } catch {
        clearTagSuggestions();
      }
    },
    [searchTagsFn, setIsLoadingTags, setTagSuggestions, clearTagSuggestions],
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
      clearError();

      try {
        await deleteInput(id);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Failed to delete input'));
      }
    },
    [deleteInput, clearError, setError],
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
    isLoading: isLoadingInputs,
    isLoadingMore,
    hasMore,
    lastError: combinedError,
    tagSuggestions,
    isLoadingTags,
    editingInput,
    isEditing,
    setInputText,
    handleSubmit,
    handleSearchTags,
    handleClearTagSuggestions,
    handleClearError,
    handleStartEditing,
    handleCancelEditing,
    handleDelete,
    handleSelectTag,
    handleLoadMore: loadMore,
  };
}
