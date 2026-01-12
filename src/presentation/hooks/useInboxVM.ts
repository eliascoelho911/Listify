/**
 * Inbox View Model Hook
 *
 * Provides a clean interface for the inbox screen to interact with the store.
 */

import { useCallback, useMemo } from 'react';

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

  const handleSubmit = useCallback(async () => {
    await store.submitInput(repository);
  }, [store, repository]);

  const handleLoadMore = useCallback(async () => {
    await store.loadMore(repository);
  }, [store, repository]);

  const handleRefresh = useCallback(async () => {
    await store.loadInputs(repository, 0);
  }, [store, repository]);

  const handleSearchTags = useCallback(
    async (query: string) => {
      await store.searchTags(repository, query);
    },
    [store, repository],
  );

  const handleClearTagSuggestions = useCallback(() => {
    store.clearTagSuggestions();
  }, [store]);

  const handleClearError = useCallback(() => {
    store.clearError();
  }, [store]);

  const handleStartEditing = useCallback(
    (input: UserInput) => {
      store.startEditing(input);
    },
    [store],
  );

  const handleCancelEditing = useCallback(() => {
    store.cancelEditing();
  }, [store]);

  const handleDelete = useCallback(
    async (id: string) => {
      await store.deleteInput(repository, id);
    },
    [store, repository],
  );

  const handleSelectTag = useCallback(
    (tag: Tag) => {
      const { inputText } = store;
      const hashIndex = inputText.lastIndexOf('#');

      if (hashIndex >= 0) {
        const beforeHash = inputText.substring(0, hashIndex);
        const newText = `${beforeHash}#${tag.name} `;
        store.setInputText(newText);
      }

      store.clearTagSuggestions();
    },
    [store],
  );

  const isEditing = useMemo(() => store.editingInput !== null, [store.editingInput]);

  return {
    inputs: store.inputs,
    inputText: store.inputText,
    isSubmitting: store.isSubmitting,
    isLoading: store.isLoading,
    lastError: store.lastError,
    tagSuggestions: store.tagSuggestions,
    isLoadingTags: store.isLoadingTags,
    hasMore: store.hasMore,
    total: store.total,
    editingInput: store.editingInput,
    isEditing,
    setInputText: store.setInputText,
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
