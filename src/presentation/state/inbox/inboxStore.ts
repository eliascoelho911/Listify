/**
 * Inbox UI Store
 *
 * Minimal Zustand store for UI state only.
 * Data comes from useLiveQuery (reactive), NOT from this store.
 * NO optimistic updates - fully reactive pattern.
 */

import { createStore, type StoreApi } from 'zustand';

import type { Tag, UserInput } from '@domain/inbox/entities';

/**
 * UI-only state for the Inbox screen.
 * Data (inputs array) comes from useLiveQuery, not from this store.
 */
export type InboxUIState = {
  /** Current input text in the bottom bar */
  inputText: string;

  /** Whether a mutation is in progress (create, update, delete) */
  isSubmitting: boolean;

  /** Last error that occurred */
  lastError: Error | null;

  /** Tag suggestions for autocomplete */
  tagSuggestions: Tag[];

  /** Whether tag suggestions are loading */
  isLoadingTags: boolean;

  /** Input being edited (null if not editing) */
  editingInput: UserInput | null;
};

/**
 * Actions for managing UI state.
 */
export type InboxUIActions = {
  /** Set the input text */
  setInputText: (text: string) => void;

  /** Set the submitting state */
  setIsSubmitting: (isSubmitting: boolean) => void;

  /** Set an error */
  setError: (error: Error | null) => void;

  /** Clear the last error */
  clearError: () => void;

  /** Set tag suggestions */
  setTagSuggestions: (tags: Tag[]) => void;

  /** Clear tag suggestions */
  clearTagSuggestions: () => void;

  /** Set loading tags state */
  setIsLoadingTags: (isLoading: boolean) => void;

  /** Start editing an input */
  startEditing: (input: UserInput) => void;

  /** Cancel editing */
  cancelEditing: () => void;

  /** Reset after successful mutation (clears input text and editing state) */
  resetAfterMutation: () => void;

  /** Reset the entire store to initial state */
  reset: () => void;
};

export type InboxUIStore = InboxUIState & InboxUIActions;
export type InboxUIStoreApi = StoreApi<InboxUIStore>;

const initialState: InboxUIState = {
  inputText: '',
  isSubmitting: false,
  lastError: null,
  tagSuggestions: [],
  isLoadingTags: false,
  editingInput: null,
};

/**
 * Creates a new Inbox UI store instance.
 *
 * This store only manages UI state. Data comes from useLiveQuery.
 */
export const createInboxUIStore = (): InboxUIStoreApi =>
  createStore<InboxUIStore>()((set) => ({
    ...initialState,

    setInputText: (text) => {
      set({ inputText: text });
    },

    setIsSubmitting: (isSubmitting) => {
      set({ isSubmitting });
    },

    setError: (error) => {
      set({ lastError: error });
    },

    clearError: () => {
      set({ lastError: null });
    },

    setTagSuggestions: (tags) => {
      set({ tagSuggestions: tags, isLoadingTags: false });
    },

    clearTagSuggestions: () => {
      set({ tagSuggestions: [], isLoadingTags: false });
    },

    setIsLoadingTags: (isLoading) => {
      set({ isLoadingTags: isLoading });
    },

    startEditing: (input) => {
      set({
        editingInput: input,
        inputText: input.text,
      });
    },

    cancelEditing: () => {
      set({
        editingInput: null,
        inputText: '',
      });
    },

    resetAfterMutation: () => {
      set({
        inputText: '',
        editingInput: null,
        isSubmitting: false,
      });
    },

    reset: () => {
      set(initialState);
    },
  }));

/**
 * @deprecated Use createInboxUIStore instead.
 * This alias is provided for backward compatibility during migration.
 */
export const createInboxStore = createInboxUIStore;
export type InboxStore = InboxUIStore;
export type InboxStoreApi = InboxUIStoreApi;
