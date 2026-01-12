/**
 * Unit tests for inboxStore
 *
 * Tests cover all store actions with optimistic updates and rollback scenarios.
 */

import { createInboxStore, type InboxStoreApi } from '@presentation/state/inbox/inboxStore';

import {
  createMockInboxRepository,
  createMockTag,
  createMockUserInput,
  type MockInboxRepository,
  resetTestIds,
} from '../../../domain/inbox/testUtils';

describe('inboxStore', () => {
  let store: InboxStoreApi;
  let repository: MockInboxRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    resetTestIds();
    store = createInboxStore();
    repository = createMockInboxRepository();
  });

  describe('initial state', () => {
    it('should have correct default values', () => {
      const state = store.getState();

      expect(state.inputs).toEqual([]);
      expect(state.inputText).toBe('');
      expect(state.isSubmitting).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.lastError).toBeNull();
      expect(state.tagSuggestions).toEqual([]);
      expect(state.isLoadingTags).toBe(false);
      expect(state.currentPage).toBe(0);
      expect(state.hasMore).toBe(true);
      expect(state.total).toBe(0);
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

  describe('submitInput', () => {
    describe('creating new input', () => {
      it('should do nothing when inputText is empty', async () => {
        store.getState().setInputText('');

        await store.getState().submitInput(repository);

        expect(store.getState().inputs).toEqual([]);
        expect(store.getState().isSubmitting).toBe(false);
      });

      it('should do nothing when inputText is only whitespace', async () => {
        store.getState().setInputText('   ');

        await store.getState().submitInput(repository);

        expect(store.getState().inputs).toEqual([]);
        expect(store.getState().isSubmitting).toBe(false);
      });

      it('should create optimistic input immediately', async () => {
        store.getState().setInputText('Buy milk');

        const promise = store.getState().submitInput(repository);

        // Optimistic input should appear immediately with temp ID
        expect(store.getState().inputs).toHaveLength(1);
        expect(store.getState().inputs[0].id).toMatch(/^temp-/);
        expect(store.getState().inputs[0].text).toBe('Buy milk');

        await promise;
      });

      it('should clear inputText after optimistic update', async () => {
        store.getState().setInputText('Buy milk');

        const promise = store.getState().submitInput(repository);

        expect(store.getState().inputText).toBe('');

        await promise;
      });

      it('should replace optimistic input with server response on success', async () => {
        store.getState().setInputText('Buy milk');

        await store.getState().submitInput(repository);

        expect(store.getState().inputs).toHaveLength(1);
        expect(store.getState().inputs[0].id).not.toMatch(/^temp-/);
        expect(store.getState().inputs[0].text).toBe('Buy milk');
      });

      it('should increment total on success', async () => {
        expect(store.getState().total).toBe(0);

        store.getState().setInputText('Buy milk');
        await store.getState().submitInput(repository);

        expect(store.getState().total).toBe(1);
      });

      it('should set isSubmitting to false on success', async () => {
        store.getState().setInputText('Buy milk');
        await store.getState().submitInput(repository);

        expect(store.getState().isSubmitting).toBe(false);
      });

      it('should extract tags from text for optimistic input', async () => {
        store.getState().setInputText('Buy milk #groceries #urgent');

        const promise = store.getState().submitInput(repository);

        // Optimistic input should have tags extracted
        expect(store.getState().inputs[0].tags).toHaveLength(2);
        expect(store.getState().inputs[0].tags.map((t) => t.name)).toContain('groceries');
        expect(store.getState().inputs[0].tags.map((t) => t.name)).toContain('urgent');

        await promise;
      });

      it('should rollback to snapshot on error', async () => {
        const existingInput = createMockUserInput({ id: 'existing-1', text: 'Existing' });
        repository.inputs.push(existingInput);

        // Pre-populate store with existing input
        await store.getState().loadInputs(repository);
        expect(store.getState().inputs).toHaveLength(1);

        // Mock error
        jest.spyOn(repository, 'createUserInput').mockRejectedValueOnce(new Error('Network error'));

        store.getState().setInputText('New item');
        await store.getState().submitInput(repository);

        // Should rollback to original state
        expect(store.getState().inputs).toHaveLength(1);
        expect(store.getState().inputs[0].id).toBe('existing-1');
      });

      it('should restore inputText on error', async () => {
        jest.spyOn(repository, 'createUserInput').mockRejectedValueOnce(new Error('Network error'));

        store.getState().setInputText('Failed item');
        await store.getState().submitInput(repository);

        expect(store.getState().inputText).toBe('Failed item');
      });

      it('should set lastError on error', async () => {
        jest.spyOn(repository, 'createUserInput').mockRejectedValueOnce(new Error('Network error'));

        store.getState().setInputText('Failed item');
        await store.getState().submitInput(repository);

        expect(store.getState().lastError).toBeInstanceOf(Error);
        expect(store.getState().lastError?.message).toBe('Network error');
      });

      it('should set isSubmitting to false on error', async () => {
        jest.spyOn(repository, 'createUserInput').mockRejectedValueOnce(new Error('Network error'));

        store.getState().setInputText('Failed item');
        await store.getState().submitInput(repository);

        expect(store.getState().isSubmitting).toBe(false);
      });
    });

    describe('editing existing input', () => {
      it('should delegate to updateInput when editingInput is set', async () => {
        const existingInput = createMockUserInput({ id: 'input-1', text: 'Original' });
        repository.inputs.push(existingInput);

        // Load inputs and start editing
        await store.getState().loadInputs(repository);
        store.getState().startEditing(store.getState().inputs[0]);
        store.getState().setInputText('Updated text');

        const updateSpy = jest.spyOn(repository, 'updateUserInput');
        await store.getState().submitInput(repository);

        expect(updateSpy).toHaveBeenCalledWith({ id: 'input-1', text: 'Updated text' });
      });

      it('should not create new input when editing', async () => {
        const existingInput = createMockUserInput({ id: 'input-1', text: 'Original' });
        repository.inputs.push(existingInput);

        await store.getState().loadInputs(repository);
        store.getState().startEditing(store.getState().inputs[0]);
        store.getState().setInputText('Updated text');

        const createSpy = jest.spyOn(repository, 'createUserInput');
        await store.getState().submitInput(repository);

        expect(createSpy).not.toHaveBeenCalled();
        expect(store.getState().inputs).toHaveLength(1);
      });
    });
  });

  describe('loadInputs', () => {
    it('should set isLoading to true during load', async () => {
      let capturedLoading = false;

      jest.spyOn(repository, 'getUserInputs').mockImplementationOnce(async () => {
        capturedLoading = store.getState().isLoading;
        return { items: [], hasMore: false, total: 0, offset: 0, limit: 20 };
      });

      await store.getState().loadInputs(repository);

      expect(capturedLoading).toBe(true);
      expect(store.getState().isLoading).toBe(false);
    });

    it('should replace inputs when page is 0', async () => {
      // Pre-populate with old inputs
      const oldInputs = [
        createMockUserInput({ id: 'old-1' }),
        createMockUserInput({ id: 'old-2' }),
      ];
      repository.inputs.push(...oldInputs);
      await store.getState().loadInputs(repository);

      // Clear and add new inputs
      repository.inputs.length = 0;
      repository.inputs.push(createMockUserInput({ id: 'new-1' }));

      await store.getState().loadInputs(repository, 0);

      expect(store.getState().inputs).toHaveLength(1);
      expect(store.getState().inputs[0].id).toBe('new-1');
    });

    it('should append inputs when page > 0', async () => {
      // Load first page
      repository.inputs.push(createMockUserInput({ id: 'input-1' }));
      await store.getState().loadInputs(repository, 0);

      // Add more inputs and load next page
      repository.inputs.push(createMockUserInput({ id: 'input-2' }));

      // Mock to return only the second item for page 1
      jest.spyOn(repository, 'getUserInputs').mockResolvedValueOnce({
        items: [repository.inputs[1]],
        hasMore: false,
        total: 2,
        offset: 20,
        limit: 20,
      });

      await store.getState().loadInputs(repository, 1);

      expect(store.getState().inputs).toHaveLength(2);
    });

    it('should update currentPage, hasMore, and total', async () => {
      jest.spyOn(repository, 'getUserInputs').mockResolvedValueOnce({
        items: [createMockUserInput()],
        hasMore: true,
        total: 50,
        offset: 0,
        limit: 20,
      });

      await store.getState().loadInputs(repository, 2);

      expect(store.getState().currentPage).toBe(2);
      expect(store.getState().hasMore).toBe(true);
      expect(store.getState().total).toBe(50);
    });

    it('should set lastError on error', async () => {
      jest.spyOn(repository, 'getUserInputs').mockRejectedValueOnce(new Error('Load failed'));

      await store.getState().loadInputs(repository);

      expect(store.getState().lastError).toBeInstanceOf(Error);
      expect(store.getState().lastError?.message).toBe('Load failed');
      expect(store.getState().isLoading).toBe(false);
    });

    it('should clear lastError before loading', async () => {
      // Set an existing error
      jest.spyOn(repository, 'getUserInputs').mockRejectedValueOnce(new Error('First error'));
      await store.getState().loadInputs(repository);
      expect(store.getState().lastError).not.toBeNull();

      // Load again - error should be cleared before loading
      jest.spyOn(repository, 'getUserInputs').mockResolvedValueOnce({
        items: [],
        hasMore: false,
        total: 0,
        offset: 0,
        limit: 20,
      });

      await store.getState().loadInputs(repository);

      expect(store.getState().lastError).toBeNull();
    });
  });

  describe('loadMore', () => {
    it('should not load when isLoading is true', async () => {
      const spy = jest.spyOn(repository, 'getUserInputs');

      // Manually set isLoading
      store.setState({ isLoading: true });

      await store.getState().loadMore(repository);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not load when hasMore is false', async () => {
      const spy = jest.spyOn(repository, 'getUserInputs');

      store.setState({ hasMore: false });

      await store.getState().loadMore(repository);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should increment currentPage and call loadInputs', async () => {
      // Initial load
      jest.spyOn(repository, 'getUserInputs').mockResolvedValueOnce({
        items: [createMockUserInput()],
        hasMore: true,
        total: 40,
        offset: 0,
        limit: 20,
      });
      await store.getState().loadInputs(repository, 0);
      expect(store.getState().currentPage).toBe(0);

      // Mock next page
      jest.spyOn(repository, 'getUserInputs').mockResolvedValueOnce({
        items: [createMockUserInput()],
        hasMore: false,
        total: 40,
        offset: 20,
        limit: 20,
      });

      await store.getState().loadMore(repository);

      expect(store.getState().currentPage).toBe(1);
    });

    it('should append results to existing inputs', async () => {
      // Initial load
      const firstInput = createMockUserInput({ id: 'first' });
      jest.spyOn(repository, 'getUserInputs').mockResolvedValueOnce({
        items: [firstInput],
        hasMore: true,
        total: 2,
        offset: 0,
        limit: 20,
      });
      await store.getState().loadInputs(repository, 0);

      // Load more
      const secondInput = createMockUserInput({ id: 'second' });
      jest.spyOn(repository, 'getUserInputs').mockResolvedValueOnce({
        items: [secondInput],
        hasMore: false,
        total: 2,
        offset: 20,
        limit: 20,
      });
      await store.getState().loadMore(repository);

      expect(store.getState().inputs).toHaveLength(2);
      expect(store.getState().inputs[0].id).toBe('first');
      expect(store.getState().inputs[1].id).toBe('second');
    });
  });

  describe('searchTags', () => {
    it('should clear suggestions when query is empty', async () => {
      const tag1 = createMockTag({ name: 'compras' });
      const tag2 = createMockTag({ name: 'mercado' });
      store.setState({ tagSuggestions: [tag1, tag2], isLoadingTags: true });

      await store.getState().searchTags(repository, '');

      expect(store.getState().tagSuggestions).toEqual([]);
      expect(store.getState().isLoadingTags).toBe(false);
    });

    it('should set isLoadingTags to true during search', async () => {
      let capturedLoading = false;

      jest.spyOn(repository, 'searchTags').mockImplementationOnce(async () => {
        capturedLoading = store.getState().isLoadingTags;
        return [];
      });

      await store.getState().searchTags(repository, 'comp');

      expect(capturedLoading).toBe(true);
    });

    it('should set tagSuggestions from response', async () => {
      const tags = [createMockTag({ name: 'compras' }), createMockTag({ name: 'computador' })];
      repository.tags.push(...tags);

      await store.getState().searchTags(repository, 'comp');

      expect(store.getState().tagSuggestions).toHaveLength(2);
      expect(store.getState().isLoadingTags).toBe(false);
    });

    it('should clear suggestions on error', async () => {
      store.setState({ tagSuggestions: [createMockTag()] });

      jest.spyOn(repository, 'searchTags').mockRejectedValueOnce(new Error('Search failed'));

      await store.getState().searchTags(repository, 'comp');

      expect(store.getState().tagSuggestions).toEqual([]);
      expect(store.getState().isLoadingTags).toBe(false);
    });
  });

  describe('clearTagSuggestions', () => {
    it('should clear tagSuggestions and set isLoadingTags to false', () => {
      store.setState({
        tagSuggestions: [createMockTag(), createMockTag()],
        isLoadingTags: true,
      });

      store.getState().clearTagSuggestions();

      expect(store.getState().tagSuggestions).toEqual([]);
      expect(store.getState().isLoadingTags).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should set lastError to null', () => {
      store.setState({ lastError: new Error('Some error') });

      store.getState().clearError();

      expect(store.getState().lastError).toBeNull();
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
      store.setState({ editingInput: input });

      store.getState().cancelEditing();

      expect(store.getState().editingInput).toBeNull();
    });

    it('should clear inputText', () => {
      store.setState({ inputText: 'Some text', editingInput: createMockUserInput() });

      store.getState().cancelEditing();

      expect(store.getState().inputText).toBe('');
    });
  });

  describe('updateInput', () => {
    beforeEach(async () => {
      // Setup: add an input to the repository and load it
      repository.inputs.push(createMockUserInput({ id: 'input-1', text: 'Original text' }));
      await store.getState().loadInputs(repository);
    });

    it('should do nothing when text is empty', async () => {
      const originalInput = store.getState().inputs[0];

      await store.getState().updateInput(repository, 'input-1', '');

      expect(store.getState().inputs[0]).toEqual(originalInput);
    });

    it('should do nothing when text is only whitespace', async () => {
      const originalInput = store.getState().inputs[0];

      await store.getState().updateInput(repository, 'input-1', '   ');

      expect(store.getState().inputs[0]).toEqual(originalInput);
    });

    it('should apply optimistic update to input', async () => {
      store.getState().startEditing(store.getState().inputs[0]);

      const promise = store.getState().updateInput(repository, 'input-1', 'Updated text');

      // Optimistic update should be applied immediately
      expect(store.getState().inputs[0].text).toBe('Updated text');

      await promise;
    });

    it('should clear inputText and editingInput on update', async () => {
      store.getState().startEditing(store.getState().inputs[0]);
      store.getState().setInputText('Updated text');

      await store.getState().updateInput(repository, 'input-1', 'Updated text');

      expect(store.getState().inputText).toBe('');
      expect(store.getState().editingInput).toBeNull();
    });

    it('should extract tags for optimistic update', async () => {
      store.getState().startEditing(store.getState().inputs[0]);

      const promise = store.getState().updateInput(repository, 'input-1', 'Updated #newtag');

      expect(store.getState().inputs[0].tags).toHaveLength(1);
      expect(store.getState().inputs[0].tags[0].name).toBe('newtag');

      await promise;
    });

    it('should rollback on error and restore editingInput', async () => {
      const originalInput = store.getState().inputs[0];
      store.getState().startEditing(originalInput);
      store.getState().setInputText('Updated text');

      jest.spyOn(repository, 'updateUserInput').mockRejectedValueOnce(new Error('Update failed'));

      await store.getState().updateInput(repository, 'input-1', 'Updated text');

      // Should rollback
      expect(store.getState().inputs[0].text).toBe('Original text');
      expect(store.getState().inputText).toBe('Original text');
      expect(store.getState().editingInput).toBe(originalInput);
      expect(store.getState().lastError?.message).toBe('Update failed');
      expect(store.getState().isSubmitting).toBe(false);
    });
  });

  describe('deleteInput', () => {
    beforeEach(async () => {
      repository.inputs.push(
        createMockUserInput({ id: 'input-1', text: 'First' }),
        createMockUserInput({ id: 'input-2', text: 'Second' }),
      );
      await store.getState().loadInputs(repository);
    });

    it('should remove input optimistically', async () => {
      expect(store.getState().inputs).toHaveLength(2);

      const promise = store.getState().deleteInput(repository, 'input-1');

      // Should be removed immediately
      expect(store.getState().inputs).toHaveLength(1);
      expect(store.getState().inputs[0].id).toBe('input-2');

      await promise;
    });

    it('should decrement total', async () => {
      expect(store.getState().total).toBe(2);

      await store.getState().deleteInput(repository, 'input-1');

      expect(store.getState().total).toBe(1);
    });

    it('should clear lastError before delete', async () => {
      store.setState({ lastError: new Error('Previous error') });

      await store.getState().deleteInput(repository, 'input-1');

      expect(store.getState().lastError).toBeNull();
    });

    it('should rollback on error', async () => {
      jest.spyOn(repository, 'deleteUserInput').mockRejectedValueOnce(new Error('Delete failed'));

      await store.getState().deleteInput(repository, 'input-1');

      // Should rollback
      expect(store.getState().inputs).toHaveLength(2);
      expect(store.getState().inputs[0].id).toBe('input-1');
    });

    it('should restore total on error', async () => {
      jest.spyOn(repository, 'deleteUserInput').mockRejectedValueOnce(new Error('Delete failed'));

      await store.getState().deleteInput(repository, 'input-1');

      expect(store.getState().total).toBe(2);
      expect(store.getState().lastError?.message).toBe('Delete failed');
    });
  });

  describe('reset', () => {
    it('should restore all state to initial values', () => {
      // Populate with various state
      store.setState({
        inputs: [createMockUserInput()],
        inputText: 'Some text',
        isSubmitting: true,
        isLoading: true,
        lastError: new Error('Some error'),
        tagSuggestions: [createMockTag()],
        isLoadingTags: true,
        currentPage: 5,
        hasMore: false,
        total: 100,
        editingInput: createMockUserInput(),
      });

      store.getState().reset();

      const state = store.getState();
      expect(state.inputs).toEqual([]);
      expect(state.inputText).toBe('');
      expect(state.isSubmitting).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.lastError).toBeNull();
      expect(state.tagSuggestions).toEqual([]);
      expect(state.isLoadingTags).toBe(false);
      expect(state.currentPage).toBe(0);
      expect(state.hasMore).toBe(true);
      expect(state.total).toBe(0);
      expect(state.editingInput).toBeNull();
    });
  });
});
