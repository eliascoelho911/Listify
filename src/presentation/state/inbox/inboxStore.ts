/**
 * Inbox Store
 *
 * Zustand store for managing inbox state with optimistic updates.
 */

import { create } from 'zustand';

import type { Tag, UserInput } from '@domain/inbox/entities';
import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';
import { createUserInput } from '@domain/inbox/use-cases/CreateUserInput';
import { extractTags } from '@domain/inbox/use-cases/extractTags';

export type InboxState = {
  /** List of user inputs */
  inputs: UserInput[];

  /** Current input text in the bottom bar */
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

  /** Current page for pagination */
  currentPage: number;

  /** Whether there are more inputs to load */
  hasMore: boolean;

  /** Total number of inputs */
  total: number;

  /** Input being edited (null if not editing) */
  editingInput: UserInput | null;
};

export type InboxActions = {
  /** Set the input text */
  setInputText: (text: string) => void;

  /** Submit a new input */
  submitInput: (repository: InboxRepository) => Promise<void>;

  /** Load inputs from repository */
  loadInputs: (repository: InboxRepository, page?: number) => Promise<void>;

  /** Load more inputs (next page) */
  loadMore: (repository: InboxRepository) => Promise<void>;

  /** Search tags for autocomplete */
  searchTags: (repository: InboxRepository, query: string) => Promise<void>;

  /** Clear tag suggestions */
  clearTagSuggestions: () => void;

  /** Clear last error */
  clearError: () => void;

  /** Start editing an input */
  startEditing: (input: UserInput) => void;

  /** Cancel editing */
  cancelEditing: () => void;

  /** Update an existing input */
  updateInput: (repository: InboxRepository, id: string, text: string) => Promise<void>;

  /** Delete an input */
  deleteInput: (repository: InboxRepository, id: string) => Promise<void>;

  /** Reset the store */
  reset: () => void;
};

export type InboxStore = InboxState & InboxActions;

const initialState: InboxState = {
  inputs: [],
  inputText: '',
  isSubmitting: false,
  isLoading: false,
  lastError: null,
  tagSuggestions: [],
  isLoadingTags: false,
  currentPage: 0,
  hasMore: true,
  total: 0,
  editingInput: null,
};

export const useInboxStore = create<InboxStore>((set, get) => ({
  ...initialState,

  setInputText: (text) => {
    set({ inputText: text });
  },

  submitInput: async (repository) => {
    const { inputText, inputs, editingInput } = get();
    const trimmedText = inputText.trim();

    if (trimmedText.length === 0) return;

    if (editingInput) {
      await get().updateInput(repository, editingInput.id, trimmedText);
      return;
    }

    set({ isSubmitting: true, lastError: null });

    const optimisticInput: UserInput = {
      id: `temp-${Date.now()}`,
      text: trimmedText,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: extractTags({ text: trimmedText }).tagNames.map((name, index) => ({
        id: `temp-tag-${index}`,
        name,
        usageCount: 1,
        createdAt: new Date(),
      })),
    };

    const snapshot = [...inputs];
    set({
      inputs: [...inputs, optimisticInput],
      inputText: '',
    });

    try {
      const newInput = await createUserInput({ text: trimmedText }, { repository });

      set((state) => ({
        inputs: state.inputs.map((input) => (input.id === optimisticInput.id ? newInput : input)),
        isSubmitting: false,
        total: state.total + 1,
      }));
    } catch (error) {
      set({
        inputs: snapshot,
        inputText: trimmedText,
        isSubmitting: false,
        lastError: error instanceof Error ? error : new Error('Failed to create input'),
      });
    }
  },

  loadInputs: async (repository, page = 0) => {
    set({ isLoading: true, lastError: null });

    try {
      const result = await repository.getUserInputs({ page, limit: 20 });

      set({
        inputs: page === 0 ? result.items : [...get().inputs, ...result.items],
        isLoading: false,
        currentPage: page,
        hasMore: result.hasMore,
        total: result.total,
      });
    } catch (error) {
      set({
        isLoading: false,
        lastError: error instanceof Error ? error : new Error('Failed to load inputs'),
      });
    }
  },

  loadMore: async (repository) => {
    const { isLoading, hasMore, currentPage } = get();

    if (isLoading || !hasMore) return;

    await get().loadInputs(repository, currentPage + 1);
  },

  searchTags: async (repository, query) => {
    if (query.length === 0) {
      set({ tagSuggestions: [], isLoadingTags: false });
      return;
    }

    set({ isLoadingTags: true });

    try {
      const tags = await repository.searchTags({ query, limit: 5 });
      set({ tagSuggestions: tags, isLoadingTags: false });
    } catch {
      set({ tagSuggestions: [], isLoadingTags: false });
    }
  },

  clearTagSuggestions: () => {
    set({ tagSuggestions: [], isLoadingTags: false });
  },

  clearError: () => {
    set({ lastError: null });
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

  updateInput: async (repository, id, text) => {
    const { inputs, editingInput } = get();
    const trimmedText = text.trim();

    if (trimmedText.length === 0) return;

    set({ isSubmitting: true, lastError: null });

    const snapshot = [...inputs];

    set((state) => ({
      inputs: state.inputs.map((input) =>
        input.id === id
          ? {
              ...input,
              text: trimmedText,
              updatedAt: new Date(),
              tags: extractTags({ text: trimmedText }).tagNames.map((name, index) => ({
                id: `temp-tag-${index}`,
                name,
                usageCount: 1,
                createdAt: new Date(),
              })),
            }
          : input,
      ),
      inputText: '',
      editingInput: null,
    }));

    try {
      const updatedInput = await repository.updateUserInput({ id, text: trimmedText });

      set((state) => ({
        inputs: state.inputs.map((input) => (input.id === id ? updatedInput : input)),
        isSubmitting: false,
      }));
    } catch (error) {
      set({
        inputs: snapshot,
        inputText: editingInput?.text ?? '',
        editingInput,
        isSubmitting: false,
        lastError: error instanceof Error ? error : new Error('Failed to update input'),
      });
    }
  },

  deleteInput: async (repository, id) => {
    const { inputs } = get();

    set({ lastError: null });

    const snapshot = [...inputs];

    set((state) => ({
      inputs: state.inputs.filter((input) => input.id !== id),
      total: state.total - 1,
    }));

    try {
      await repository.deleteUserInput(id);
    } catch (error) {
      set({
        inputs: snapshot,
        total: get().total + 1,
        lastError: error instanceof Error ? error : new Error('Failed to delete input'),
      });
    }
  },

  reset: () => {
    set(initialState);
  },
}));
