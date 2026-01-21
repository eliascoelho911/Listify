/**
 * useItemStore - Zustand store for managing items across all item types
 *
 * Implements optimistic updates with rollback on error.
 * Handles creation of items for all list types (note, shopping, movie, book, game).
 */

import { create, type StoreApi, type UseBoundStore } from 'zustand';

import type {
  BookItem,
  CreateBookItemInput,
  CreateGameItemInput,
  CreateItemInput,
  CreateMovieItemInput,
  CreateNoteItemInput,
  CreateShoppingItemInput,
  GameItem,
  Item,
  ItemType,
  MovieItem,
  NoteItem,
  ShoppingItem,
  UpdateBookItemInput,
  UpdateGameItemInput,
  UpdateMovieItemInput,
  UpdateNoteItemInput,
  UpdateShoppingItemInput,
} from '@domain/item';
import type {
  BookItemRepository,
  GameItemRepository,
  MovieItemRepository,
  NoteItemRepository,
  ShoppingItemRepository,
} from '@domain/item/ports/item.repository';

/**
 * Dependencies required by the item store
 */
export interface ItemStoreDependencies {
  noteItemRepository: NoteItemRepository;
  shoppingItemRepository: ShoppingItemRepository;
  movieItemRepository: MovieItemRepository;
  bookItemRepository: BookItemRepository;
  gameItemRepository: GameItemRepository;
}

/**
 * State shape for the item store
 */
export interface ItemStoreState {
  /** All items loaded in memory (for current view) */
  items: Item[];

  /** Whether a loading operation is in progress */
  isLoading: boolean;

  /** Current error message, if any */
  error: string | null;

  /** Whether the store has been initialized */
  initialized: boolean;
}

/**
 * Actions available on the item store
 */
export interface ItemStoreActions {
  /**
   * Create a new item with optimistic update
   * @param input - The item input with type discriminator
   * @returns The created item, or null on failure
   */
  createItem: (input: CreateItemInput) => Promise<Item | null>;

  /**
   * Update an existing item with optimistic update
   * @param id - The item ID
   * @param type - The item type
   * @param updates - The updates to apply
   * @returns The updated item, or null on failure
   */
  updateItem: (
    id: string,
    type: ItemType,
    updates:
      | UpdateNoteItemInput
      | UpdateShoppingItemInput
      | UpdateMovieItemInput
      | UpdateBookItemInput
      | UpdateGameItemInput,
  ) => Promise<Item | null>;

  /**
   * Delete an item with optimistic update
   * @param id - The item ID
   * @param type - The item type
   * @returns True if deleted successfully
   */
  deleteItem: (id: string, type: ItemType) => Promise<boolean>;

  /**
   * Toggle the checked state of a checkable item (shopping, movie, book, game)
   * @param id - The item ID
   * @param type - The item type
   * @returns The updated item, or null on failure
   */
  toggleChecked: (id: string, type: Exclude<ItemType, 'note'>) => Promise<Item | null>;

  /**
   * Load items by list ID
   * @param listId - The list ID to load items for
   * @param type - The item type
   */
  loadByListId: (listId: string, type: ItemType) => Promise<void>;

  /**
   * Load items without a list (Inbox items)
   */
  loadInboxItems: () => Promise<void>;

  /**
   * Clear all items from the store
   */
  clearItems: () => void;

  /**
   * Clear any error state
   */
  clearError: () => void;
}

export type ItemStore = ItemStoreState & ItemStoreActions;

/**
 * Type for the created store instance
 */
export type ItemStoreInstance = UseBoundStore<StoreApi<ItemStore>>;

/**
 * Generate a temporary ID for optimistic updates
 */
function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Create an optimistic item from input
 */
function createOptimisticItem(input: CreateItemInput, tempId: string): Item {
  const now = new Date();
  const base = {
    id: tempId,
    listId: input.listId,
    sectionId: input.sectionId,
    title: input.title,
    sortOrder: input.sortOrder,
    createdAt: now,
    updatedAt: now,
  };

  switch (input.type) {
    case 'note':
      return {
        ...base,
        type: 'note',
        description: (input as CreateNoteItemInput).description,
      } as NoteItem;

    case 'shopping':
      return {
        ...base,
        type: 'shopping',
        quantity: (input as CreateShoppingItemInput).quantity,
        price: (input as CreateShoppingItemInput).price,
        isChecked: (input as CreateShoppingItemInput).isChecked,
      } as ShoppingItem;

    case 'movie':
      return {
        ...base,
        type: 'movie',
        externalId: (input as CreateMovieItemInput).externalId,
        metadata: (input as CreateMovieItemInput).metadata,
        isChecked: (input as CreateMovieItemInput).isChecked,
      } as MovieItem;

    case 'book':
      return {
        ...base,
        type: 'book',
        externalId: (input as CreateBookItemInput).externalId,
        metadata: (input as CreateBookItemInput).metadata,
        isChecked: (input as CreateBookItemInput).isChecked,
      } as BookItem;

    case 'game':
      return {
        ...base,
        type: 'game',
        externalId: (input as CreateGameItemInput).externalId,
        metadata: (input as CreateGameItemInput).metadata,
        isChecked: (input as CreateGameItemInput).isChecked,
      } as GameItem;

    default: {
      const exhaustiveCheck: never = input;
      throw new Error(`Unknown item type: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}

/**
 * Create the item store factory
 *
 * @param deps - Repository dependencies
 * @returns A configured Zustand store
 */
export function createItemStore(deps: ItemStoreDependencies): ItemStoreInstance {
  const {
    noteItemRepository,
    shoppingItemRepository,
    movieItemRepository,
    bookItemRepository,
    gameItemRepository,
  } = deps;

  return create<ItemStore>((set, get) => ({
    // Initial state
    items: [],
    isLoading: false,
    error: null,
    initialized: false,

    // Create item with optimistic update
    createItem: async (input: CreateItemInput): Promise<Item | null> => {
      const tempId = generateTempId();
      const optimisticItem = createOptimisticItem(input, tempId);

      // Backup current state for rollback
      const backup = get().items;

      // Optimistic update - add item immediately
      set({ items: [...backup, optimisticItem], error: null });

      try {
        let created: Item;

        switch (input.type) {
          case 'note':
            created = await noteItemRepository.create(input as CreateNoteItemInput);
            break;
          case 'shopping':
            created = await shoppingItemRepository.create(input as CreateShoppingItemInput);
            break;
          case 'movie':
            created = await movieItemRepository.create(input as CreateMovieItemInput);
            break;
          case 'book':
            created = await bookItemRepository.create(input as CreateBookItemInput);
            break;
          case 'game':
            created = await gameItemRepository.create(input as CreateGameItemInput);
            break;
          default: {
            const exhaustiveCheck: never = input;
            throw new Error(`Unknown item type: ${JSON.stringify(exhaustiveCheck)}`);
          }
        }

        // Replace optimistic item with real item
        set({
          items: get().items.map((item) => (item.id === tempId ? created : item)),
        });

        console.debug('[useItemStore] Created item:', created.id);
        return created;
      } catch (error) {
        // Rollback on error
        set({ items: backup, error: 'Failed to create item' });
        console.error('[useItemStore] Failed to create item:', error);
        return null;
      }
    },

    // Update item with optimistic update
    updateItem: async (
      id: string,
      type: ItemType,
      updates:
        | UpdateNoteItemInput
        | UpdateShoppingItemInput
        | UpdateMovieItemInput
        | UpdateBookItemInput
        | UpdateGameItemInput,
    ): Promise<Item | null> => {
      const backup = get().items;
      const existingIndex = backup.findIndex((item) => item.id === id);

      if (existingIndex === -1) {
        return null;
      }

      const existingItem = backup[existingIndex];

      // Optimistic update - apply changes immediately
      const optimisticItem = { ...existingItem, ...updates, updatedAt: new Date() } as Item;
      const newItems = [...backup];
      newItems[existingIndex] = optimisticItem;
      set({ items: newItems, error: null });

      try {
        let updated: Item | null = null;

        switch (type) {
          case 'note':
            updated = await noteItemRepository.update(id, updates as UpdateNoteItemInput);
            break;
          case 'shopping':
            updated = await shoppingItemRepository.update(id, updates as UpdateShoppingItemInput);
            break;
          case 'movie':
            updated = await movieItemRepository.update(id, updates as UpdateMovieItemInput);
            break;
          case 'book':
            updated = await bookItemRepository.update(id, updates as UpdateBookItemInput);
            break;
          case 'game':
            updated = await gameItemRepository.update(id, updates as UpdateGameItemInput);
            break;
          default: {
            const exhaustiveCheck: never = type;
            throw new Error(`Unknown item type: ${exhaustiveCheck}`);
          }
        }

        if (!updated) {
          // Item not found in DB - rollback
          set({ items: backup, error: 'Item not found' });
          return null;
        }

        // Replace with actual updated item
        set({
          items: get().items.map((item) => (item.id === id ? updated : item)),
        });

        console.debug('[useItemStore] Updated item:', id);
        return updated;
      } catch (error) {
        // Rollback on error
        set({ items: backup, error: 'Failed to update item' });
        console.error('[useItemStore] Failed to update item:', error);
        return null;
      }
    },

    // Delete item with optimistic update
    deleteItem: async (id: string, type: ItemType): Promise<boolean> => {
      const backup = get().items;

      // Optimistic update - remove item immediately
      set({ items: backup.filter((item) => item.id !== id), error: null });

      try {
        let success = false;

        switch (type) {
          case 'note':
            success = await noteItemRepository.delete(id);
            break;
          case 'shopping':
            success = await shoppingItemRepository.delete(id);
            break;
          case 'movie':
            success = await movieItemRepository.delete(id);
            break;
          case 'book':
            success = await bookItemRepository.delete(id);
            break;
          case 'game':
            success = await gameItemRepository.delete(id);
            break;
          default: {
            const exhaustiveCheck: never = type;
            throw new Error(`Unknown item type: ${exhaustiveCheck}`);
          }
        }

        if (!success) {
          // Delete failed - rollback
          set({ items: backup, error: 'Failed to delete item' });
          return false;
        }

        console.debug('[useItemStore] Deleted item:', id);
        return true;
      } catch (error) {
        // Rollback on error
        set({ items: backup, error: 'Failed to delete item' });
        console.error('[useItemStore] Failed to delete item:', error);
        return false;
      }
    },

    // Toggle checked state for checkable items
    toggleChecked: async (id: string, type: Exclude<ItemType, 'note'>): Promise<Item | null> => {
      const items = get().items;
      const item = items.find((i) => i.id === id);

      if (!item || item.type === 'note') {
        return null;
      }

      const currentChecked = 'isChecked' in item ? item.isChecked : false;
      const updates = { isChecked: !currentChecked };

      return get().updateItem(id, type, updates);
    },

    // Load items by list ID
    loadByListId: async (listId: string, type: ItemType): Promise<void> => {
      set({ isLoading: true, error: null });

      try {
        let items: Item[] = [];

        switch (type) {
          case 'note':
            items = await noteItemRepository.getByListId(listId);
            break;
          case 'shopping':
            items = await shoppingItemRepository.getByListId(listId);
            break;
          case 'movie':
            items = await movieItemRepository.getByListId(listId);
            break;
          case 'book':
            items = await bookItemRepository.getByListId(listId);
            break;
          case 'game':
            items = await gameItemRepository.getByListId(listId);
            break;
          default: {
            const exhaustiveCheck: never = type;
            throw new Error(`Unknown item type: ${exhaustiveCheck}`);
          }
        }

        set({ items, isLoading: false, initialized: true });
        console.debug(`[useItemStore] Loaded ${items.length} items for list:`, listId);
      } catch (error) {
        set({ isLoading: false, error: 'Failed to load items' });
        console.error('[useItemStore] Failed to load items:', error);
      }
    },

    // Load inbox items (items without a list)
    loadInboxItems: async (): Promise<void> => {
      set({ isLoading: true, error: null });

      try {
        // Load items from all repositories where listId is null
        // For inbox, we want to show all item types
        const [notes, shopping, movies, books, games] = await Promise.all([
          noteItemRepository.search({ type: 'note', query: '' }),
          shoppingItemRepository.search({ type: 'shopping', query: '' }),
          movieItemRepository.search({ type: 'movie', query: '' }),
          bookItemRepository.search({ type: 'book', query: '' }),
          gameItemRepository.search({ type: 'game', query: '' }),
        ]);

        // Filter only items without listId (inbox items)
        const inboxItems: Item[] = [
          ...notes.items.filter((item) => !item.listId),
          ...shopping.items.filter((item) => !item.listId),
          ...movies.items.filter((item) => !item.listId),
          ...books.items.filter((item) => !item.listId),
          ...games.items.filter((item) => !item.listId),
        ];

        // Sort by createdAt descending (newest first)
        inboxItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        set({ items: inboxItems, isLoading: false, initialized: true });
        console.debug(`[useItemStore] Loaded ${inboxItems.length} inbox items`);
      } catch (error) {
        set({ isLoading: false, error: 'Failed to load inbox items' });
        console.error('[useItemStore] Failed to load inbox items:', error);
      }
    },

    // Clear all items
    clearItems: (): void => {
      set({ items: [], initialized: false });
    },

    // Clear error state
    clearError: (): void => {
      set({ error: null });
    },
  }));
}
