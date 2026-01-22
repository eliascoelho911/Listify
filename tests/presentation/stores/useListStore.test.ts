/**
 * useListStore Unit Tests
 *
 * Tests for the list Zustand store with optimistic updates and rollback.
 */

import type { PaginatedResult } from '@domain/common/types';
import type { CreateListInput, List, ListType, UpdateListInput } from '@domain/list';
import type { ListRepository } from '@domain/list/ports/list.repository';
import { createListStore, type ListStoreInstance } from '@presentation/stores/useListStore';

const createMockList = (overrides?: Partial<List>): List => ({
  id: 'list-1',
  name: 'Test List',
  description: 'Test description',
  listType: 'shopping' as ListType,
  isPrefabricated: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

const createMockListRepository = (): jest.Mocked<ListRepository> => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
  groupBy: jest.fn(),
});

describe('useListStore', () => {
  let store: ListStoreInstance;
  let mockRepository: jest.Mocked<ListRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = createMockListRepository();
    store = createListStore({ listRepository: mockRepository });
  });

  describe('initial state', () => {
    it('should have empty lists array', () => {
      expect(store.getState().lists).toEqual([]);
    });

    it('should not be loading initially', () => {
      expect(store.getState().isLoading).toBe(false);
    });

    it('should have no error initially', () => {
      expect(store.getState().error).toBeNull();
    });

    it('should not be initialized', () => {
      expect(store.getState().initialized).toBe(false);
    });

    it('should have all categories expanded by default', () => {
      const { expandedCategories } = store.getState();
      expect(expandedCategories.notes).toBe(true);
      expect(expandedCategories.shopping).toBe(true);
      expect(expandedCategories.movies).toBe(true);
      expect(expandedCategories.books).toBe(true);
      expect(expandedCategories.games).toBe(true);
    });
  });

  describe('loadLists', () => {
    it('should load lists from repository', async () => {
      const mockLists = [createMockList(), createMockList({ id: 'list-2', name: 'List 2' })];
      const mockResult: PaginatedResult<List> = {
        items: mockLists,
        totalCount: 2,
        pagination: { offset: 0, limit: 100, hasMore: false },
      };
      mockRepository.getAll.mockResolvedValue(mockResult);

      await store.getState().loadLists();

      expect(mockRepository.getAll).toHaveBeenCalledWith({
        field: 'updatedAt',
        direction: 'desc',
      });
      expect(store.getState().lists).toEqual(mockLists);
      expect(store.getState().isLoading).toBe(false);
      expect(store.getState().initialized).toBe(true);
    });

    it('should set loading state while fetching', async () => {
      const mockResult: PaginatedResult<List> = {
        items: [],
        totalCount: 0,
        pagination: { offset: 0, limit: 100, hasMore: false },
      };
      mockRepository.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockResult), 100)),
      );

      const loadPromise = store.getState().loadLists();

      expect(store.getState().isLoading).toBe(true);

      await loadPromise;

      expect(store.getState().isLoading).toBe(false);
    });

    it('should handle load error', async () => {
      mockRepository.getAll.mockRejectedValue(new Error('Network error'));

      await store.getState().loadLists();

      expect(store.getState().error).toBe('Failed to load lists');
      expect(store.getState().isLoading).toBe(false);
    });
  });

  describe('createList', () => {
    it('should create list with optimistic update', async () => {
      const input: CreateListInput = {
        name: 'New List',
        listType: 'shopping',
        isPrefabricated: false,
      };
      const createdList = createMockList({ id: 'new-list', name: 'New List' });
      mockRepository.create.mockResolvedValue(createdList);

      const result = await store.getState().createList(input);

      expect(result).toEqual(createdList);
      expect(store.getState().lists).toContainEqual(createdList);
      expect(mockRepository.create).toHaveBeenCalledWith(input);
    });

    it('should show optimistic list immediately', async () => {
      const input: CreateListInput = {
        name: 'Optimistic List',
        listType: 'notes',
        isPrefabricated: false,
      };

      let optimisticListAdded = false;
      mockRepository.create.mockImplementation(async () => {
        // Check state during async operation
        const currentLists = store.getState().lists;
        optimisticListAdded = currentLists.some((l) => l.name === 'Optimistic List');
        return createMockList({ id: 'real-id', name: 'Optimistic List' });
      });

      await store.getState().createList(input);

      expect(optimisticListAdded).toBe(true);
    });

    it('should rollback on create error', async () => {
      const input: CreateListInput = {
        name: 'Failed List',
        listType: 'movies',
        isPrefabricated: false,
      };
      mockRepository.create.mockRejectedValue(new Error('Create failed'));

      const result = await store.getState().createList(input);

      expect(result).toBeNull();
      expect(store.getState().lists).toHaveLength(0);
      expect(store.getState().error).toBe('Failed to create list');
    });
  });

  describe('updateList', () => {
    beforeEach(async () => {
      const mockResult: PaginatedResult<List> = {
        items: [createMockList()],
        totalCount: 1,
        pagination: { offset: 0, limit: 100, hasMore: false },
      };
      mockRepository.getAll.mockResolvedValue(mockResult);
      await store.getState().loadLists();
    });

    it('should update list with optimistic update', async () => {
      const updates: UpdateListInput = { name: 'Updated Name' };
      const updatedList = createMockList({ name: 'Updated Name' });
      mockRepository.update.mockResolvedValue(updatedList);

      const result = await store.getState().updateList('list-1', updates);

      expect(result).toEqual(updatedList);
      expect(store.getState().lists[0].name).toBe('Updated Name');
    });

    it('should apply optimistic update immediately', async () => {
      const updates: UpdateListInput = { name: 'Instant Update' };

      let optimisticUpdateApplied = false;
      mockRepository.update.mockImplementation(async () => {
        const currentList = store.getState().lists[0];
        optimisticUpdateApplied = currentList.name === 'Instant Update';
        return createMockList({ name: 'Instant Update' });
      });

      await store.getState().updateList('list-1', updates);

      expect(optimisticUpdateApplied).toBe(true);
    });

    it('should rollback on update error', async () => {
      const originalName = store.getState().lists[0].name;
      mockRepository.update.mockRejectedValue(new Error('Update failed'));

      const result = await store.getState().updateList('list-1', { name: 'Failed Update' });

      expect(result).toBeNull();
      expect(store.getState().lists[0].name).toBe(originalName);
      expect(store.getState().error).toBe('Failed to update list');
    });

    it('should return null for non-existent list', async () => {
      const result = await store.getState().updateList('non-existent', { name: 'Test' });

      expect(result).toBeNull();
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteList', () => {
    beforeEach(async () => {
      const mockResult: PaginatedResult<List> = {
        items: [createMockList(), createMockList({ id: 'list-2', name: 'List 2' })],
        totalCount: 2,
        pagination: { offset: 0, limit: 100, hasMore: false },
      };
      mockRepository.getAll.mockResolvedValue(mockResult);
      await store.getState().loadLists();

      // Add item counts
      store.getState().setItemCount('list-1', 5);
      store.getState().setItemCount('list-2', 10);
    });

    it('should delete list with optimistic update', async () => {
      mockRepository.delete.mockResolvedValue(true);

      const result = await store.getState().deleteList('list-1');

      expect(result).toBe(true);
      expect(store.getState().lists).toHaveLength(1);
      expect(store.getState().lists[0].id).toBe('list-2');
    });

    it('should remove optimistically before API call', async () => {
      let optimisticDeleteApplied = false;
      mockRepository.delete.mockImplementation(async () => {
        optimisticDeleteApplied = store.getState().lists.length === 1;
        return true;
      });

      await store.getState().deleteList('list-1');

      expect(optimisticDeleteApplied).toBe(true);
    });

    it('should remove item count for deleted list', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await store.getState().deleteList('list-1');

      expect(store.getState().itemCounts['list-1']).toBeUndefined();
      expect(store.getState().itemCounts['list-2']).toBe(10);
    });

    it('should rollback on delete error', async () => {
      mockRepository.delete.mockRejectedValue(new Error('Delete failed'));

      const result = await store.getState().deleteList('list-1');

      expect(result).toBe(false);
      expect(store.getState().lists).toHaveLength(2);
      expect(store.getState().itemCounts['list-1']).toBe(5);
      expect(store.getState().error).toBe('Failed to delete list');
    });

    it('should rollback when delete returns false', async () => {
      mockRepository.delete.mockResolvedValue(false);

      const result = await store.getState().deleteList('list-1');

      expect(result).toBe(false);
      expect(store.getState().lists).toHaveLength(2);
    });
  });

  describe('getListsByCategory', () => {
    beforeEach(async () => {
      const mockResult: PaginatedResult<List> = {
        items: [
          createMockList({ id: '1', listType: 'shopping' }),
          createMockList({ id: '2', listType: 'notes' }),
          createMockList({ id: '3', listType: 'shopping' }),
          createMockList({ id: '4', listType: 'movies' }),
        ],
        totalCount: 4,
        pagination: { offset: 0, limit: 100, hasMore: false },
      };
      mockRepository.getAll.mockResolvedValue(mockResult);
      await store.getState().loadLists();
    });

    it('should return lists filtered by category', () => {
      const shoppingLists = store.getState().getListsByCategory('shopping');

      expect(shoppingLists).toHaveLength(2);
      expect(shoppingLists.every((l) => l.listType === 'shopping')).toBe(true);
    });

    it('should return empty array for category with no lists', () => {
      const bookLists = store.getState().getListsByCategory('books');

      expect(bookLists).toEqual([]);
    });
  });

  describe('toggleCategory', () => {
    it('should toggle category expansion state', () => {
      expect(store.getState().expandedCategories.shopping).toBe(true);

      store.getState().toggleCategory('shopping');

      expect(store.getState().expandedCategories.shopping).toBe(false);

      store.getState().toggleCategory('shopping');

      expect(store.getState().expandedCategories.shopping).toBe(true);
    });

    it('should only toggle specified category', () => {
      store.getState().toggleCategory('notes');

      expect(store.getState().expandedCategories.notes).toBe(false);
      expect(store.getState().expandedCategories.shopping).toBe(true);
      expect(store.getState().expandedCategories.movies).toBe(true);
    });
  });

  describe('setItemCount', () => {
    it('should set item count for a list', () => {
      store.getState().setItemCount('list-1', 10);

      expect(store.getState().itemCounts['list-1']).toBe(10);
    });

    it('should update existing item count', () => {
      store.getState().setItemCount('list-1', 5);
      store.getState().setItemCount('list-1', 15);

      expect(store.getState().itemCounts['list-1']).toBe(15);
    });
  });

  describe('clearLists', () => {
    beforeEach(async () => {
      const mockResult: PaginatedResult<List> = {
        items: [createMockList()],
        totalCount: 1,
        pagination: { offset: 0, limit: 100, hasMore: false },
      };
      mockRepository.getAll.mockResolvedValue(mockResult);
      await store.getState().loadLists();
      store.getState().setItemCount('list-1', 5);
      store.getState().toggleCategory('shopping');
    });

    it('should clear all lists', () => {
      store.getState().clearLists();

      expect(store.getState().lists).toEqual([]);
    });

    it('should reset initialized flag', () => {
      store.getState().clearLists();

      expect(store.getState().initialized).toBe(false);
    });

    it('should clear item counts', () => {
      store.getState().clearLists();

      expect(store.getState().itemCounts).toEqual({});
    });

    it('should reset category expansion state', () => {
      store.getState().clearLists();

      expect(store.getState().expandedCategories.shopping).toBe(true);
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      mockRepository.getAll.mockRejectedValue(new Error('Error'));
      await store.getState().loadLists();

      expect(store.getState().error).not.toBeNull();

      store.getState().clearError();

      expect(store.getState().error).toBeNull();
    });
  });
});
