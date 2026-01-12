/**
 * Unit tests for inboxUIStore (simplified reactive version)
 *
 * Tests cover all UI state actions. Data actions are now handled by useLiveQuery.
 */

import { createInboxUIStore, type InboxUIStoreApi } from '@presentation/state/inbox/inboxStore';

import { createMockTag, createMockUserInput, resetTestIds } from '../../../domain/inbox/testUtils';

describe('inboxUIStore', () => {
  let store: InboxUIStoreApi;

  beforeEach(() => {
    jest.clearAllMocks();
    resetTestIds();
    store = createInboxUIStore();
  });

  describe('initial state', () => {
    it('should have correct default values', () => {
      const state = store.getState();

      expect(state.inputText).toBe('');
      expect(state.isSubmitting).toBe(false);
      expect(state.lastError).toBeNull();
      expect(state.tagSuggestions).toEqual([]);
      expect(state.isLoadingTags).toBe(false);
      expect(state.editingInput).toBeNull();
    });
  });

  describe('setInputText', () => {
    it('should update inputText with provided value', () => {
      store.getState().setInputText('Buy milk');

      expect(store.getState().inputText).toBe('Buy milk');
    });

    it('should handle empty string', () => {
      store.getState().setInputText('some text');
      store.getState().setInputText('');

      expect(store.getState().inputText).toBe('');
    });

    it('should handle text with tags', () => {
      store.getState().setInputText('Buy milk #groceries #urgent');

      expect(store.getState().inputText).toBe('Buy milk #groceries #urgent');
    });
  });

  describe('setIsSubmitting', () => {
    it('should set isSubmitting to true', () => {
      store.getState().setIsSubmitting(true);

      expect(store.getState().isSubmitting).toBe(true);
    });

    it('should set isSubmitting to false', () => {
      store.getState().setIsSubmitting(true);
      store.getState().setIsSubmitting(false);

      expect(store.getState().isSubmitting).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set lastError to provided error', () => {
      const error = new Error('Test error');

      store.getState().setError(error);

      expect(store.getState().lastError).toBe(error);
    });

    it('should set lastError to null', () => {
      store.getState().setError(new Error('Test'));
      store.getState().setError(null);

      expect(store.getState().lastError).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should set lastError to null', () => {
      store.getState().setError(new Error('Some error'));

      store.getState().clearError();

      expect(store.getState().lastError).toBeNull();
    });
  });

  describe('setTagSuggestions', () => {
    it('should set tagSuggestions', () => {
      const tags = [createMockTag({ name: 'groceries' }), createMockTag({ name: 'urgent' })];

      store.getState().setTagSuggestions(tags);

      expect(store.getState().tagSuggestions).toHaveLength(2);
      expect(store.getState().tagSuggestions[0].name).toBe('groceries');
    });

    it('should set isLoadingTags to false', () => {
      store.getState().setIsLoadingTags(true);

      store.getState().setTagSuggestions([]);

      expect(store.getState().isLoadingTags).toBe(false);
    });
  });

  describe('clearTagSuggestions', () => {
    it('should clear tagSuggestions', () => {
      store.getState().setTagSuggestions([createMockTag(), createMockTag()]);

      store.getState().clearTagSuggestions();

      expect(store.getState().tagSuggestions).toEqual([]);
    });

    it('should set isLoadingTags to false', () => {
      store.getState().setIsLoadingTags(true);

      store.getState().clearTagSuggestions();

      expect(store.getState().isLoadingTags).toBe(false);
    });
  });

  describe('setIsLoadingTags', () => {
    it('should set isLoadingTags to true', () => {
      store.getState().setIsLoadingTags(true);

      expect(store.getState().isLoadingTags).toBe(true);
    });

    it('should set isLoadingTags to false', () => {
      store.getState().setIsLoadingTags(true);
      store.getState().setIsLoadingTags(false);

      expect(store.getState().isLoadingTags).toBe(false);
    });
  });

  describe('startEditing', () => {
    it('should set editingInput to provided input', () => {
      const input = createMockUserInput({ id: 'input-1', text: 'Original text' });

      store.getState().startEditing(input);

      expect(store.getState().editingInput).toBe(input);
    });

    it('should set inputText to input text', () => {
      const input = createMockUserInput({ text: 'Original text' });

      store.getState().startEditing(input);

      expect(store.getState().inputText).toBe('Original text');
    });
  });

  describe('cancelEditing', () => {
    it('should clear editingInput', () => {
      const input = createMockUserInput();
      store.getState().startEditing(input);

      store.getState().cancelEditing();

      expect(store.getState().editingInput).toBeNull();
    });

    it('should clear inputText', () => {
      store.getState().setInputText('Some text');
      store.getState().startEditing(createMockUserInput());

      store.getState().cancelEditing();

      expect(store.getState().inputText).toBe('');
    });
  });

  describe('resetAfterMutation', () => {
    it('should clear inputText', () => {
      store.getState().setInputText('Some text');

      store.getState().resetAfterMutation();

      expect(store.getState().inputText).toBe('');
    });

    it('should clear editingInput', () => {
      store.getState().startEditing(createMockUserInput());

      store.getState().resetAfterMutation();

      expect(store.getState().editingInput).toBeNull();
    });

    it('should set isSubmitting to false', () => {
      store.getState().setIsSubmitting(true);

      store.getState().resetAfterMutation();

      expect(store.getState().isSubmitting).toBe(false);
    });
  });

  describe('reset', () => {
    it('should restore all state to initial values', () => {
      store.getState().setInputText('Some text');
      store.getState().setIsSubmitting(true);
      store.getState().setError(new Error('Some error'));
      store.getState().setTagSuggestions([createMockTag()]);
      store.getState().setIsLoadingTags(true);
      store.getState().startEditing(createMockUserInput());

      store.getState().reset();

      const state = store.getState();
      expect(state.inputText).toBe('');
      expect(state.isSubmitting).toBe(false);
      expect(state.lastError).toBeNull();
      expect(state.tagSuggestions).toEqual([]);
      expect(state.isLoadingTags).toBe(false);
      expect(state.editingInput).toBeNull();
    });
  });
});
