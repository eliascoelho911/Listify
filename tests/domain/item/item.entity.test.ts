import type {
  BookItem,
  BookMetadata,
  CreateItemInput,
  CreateNoteItemInput,
  CreateShoppingItemInput,
  ExternalMetadata,
  GameItem,
  GameMetadata,
  Item,
  ItemType,
  MovieItem,
  MovieMetadata,
  NoteItem,
  ShoppingItem,
  UpdateItemInput,
  UpdateShoppingItemInput,
} from '@domain/item';

describe('Item Entity', () => {
  describe('Item discriminated union', () => {
    it('should narrow type correctly for NoteItem', () => {
      const item: Item = {
        id: '1',
        listId: 'list-1',
        title: 'Remember to call',
        type: 'note',
        description: 'Call the doctor',
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (item.type === 'note') {
        // TypeScript should narrow to NoteItem
        expect(item.description).toBe('Call the doctor');
      }
    });

    it('should narrow type correctly for ShoppingItem', () => {
      const item: Item = {
        id: '2',
        listId: 'list-1',
        title: 'Milk',
        type: 'shopping',
        quantity: '2L',
        price: 5.99,
        isChecked: false,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (item.type === 'shopping') {
        // TypeScript should narrow to ShoppingItem
        expect(item.price).toBe(5.99);
        expect(item.quantity).toBe('2L');
        expect(item.isChecked).toBe(false);
      }
    });

    it('should narrow type correctly for MovieItem', () => {
      const movieMetadata: MovieMetadata = {
        category: 'movie',
        coverUrl: 'https://example.com/poster.jpg',
        description: 'A great movie',
        releaseDate: '2024-01-15',
        rating: 8.5,
        cast: ['Actor 1', 'Actor 2'],
      };

      const item: Item = {
        id: '3',
        listId: 'list-1',
        title: 'Inception',
        type: 'movie',
        externalId: 'tmdb-123',
        metadata: movieMetadata,
        isChecked: true,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (item.type === 'movie') {
        expect(item.metadata?.category).toBe('movie');
        expect(item.metadata?.cast).toContain('Actor 1');
        expect(item.isChecked).toBe(true);
      }
    });

    it('should narrow type correctly for BookItem', () => {
      const bookMetadata: BookMetadata = {
        category: 'book',
        coverUrl: 'https://example.com/cover.jpg',
        description: 'A great book',
        authors: ['Author 1', 'Author 2'],
      };

      const item: Item = {
        id: '4',
        listId: 'list-1',
        title: 'Clean Code',
        type: 'book',
        externalId: 'gbooks-456',
        metadata: bookMetadata,
        isChecked: false,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (item.type === 'book') {
        expect(item.metadata?.category).toBe('book');
        expect(item.metadata?.authors).toContain('Author 1');
      }
    });

    it('should narrow type correctly for GameItem', () => {
      const gameMetadata: GameMetadata = {
        category: 'game',
        coverUrl: 'https://example.com/game.jpg',
        description: 'A great game',
        developer: 'Nintendo',
      };

      const item: Item = {
        id: '5',
        listId: 'list-1',
        title: 'Zelda TOTK',
        type: 'game',
        externalId: 'igdb-789',
        metadata: gameMetadata,
        isChecked: false,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (item.type === 'game') {
        expect(item.metadata?.category).toBe('game');
        expect(item.metadata?.developer).toBe('Nintendo');
      }
    });
  });

  describe('ItemType union', () => {
    it('should contain all valid item types', () => {
      const validTypes: ItemType[] = ['note', 'shopping', 'movie', 'book', 'game'];

      validTypes.forEach((type) => {
        expect(['note', 'shopping', 'movie', 'book', 'game']).toContain(type);
      });
    });
  });

  describe('Item without list (Inbox)', () => {
    it('should allow item without listId (goes to Inbox)', () => {
      const inboxItem: NoteItem = {
        id: '1',
        title: 'Quick note',
        type: 'note',
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(inboxItem.listId).toBeUndefined();
    });

    it('should allow item without sectionId', () => {
      const itemWithoutSection: ShoppingItem = {
        id: '1',
        listId: 'list-1',
        title: 'Bread',
        type: 'shopping',
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(itemWithoutSection.sectionId).toBeUndefined();
    });
  });

  describe('Metadata types', () => {
    it('should have correct shape for MovieMetadata', () => {
      const metadata: MovieMetadata = {
        category: 'movie',
        coverUrl: 'url',
        description: 'desc',
        releaseDate: '2024-01-01',
        rating: 9.0,
        cast: ['Actor'],
      };

      expect(metadata.category).toBe('movie');
      expect(metadata.cast).toEqual(['Actor']);
    });

    it('should have correct shape for BookMetadata', () => {
      const metadata: BookMetadata = {
        category: 'book',
        authors: ['Author'],
      };

      expect(metadata.category).toBe('book');
      expect(metadata.authors).toEqual(['Author']);
    });

    it('should have correct shape for GameMetadata', () => {
      const metadata: GameMetadata = {
        category: 'game',
        developer: 'Studio',
      };

      expect(metadata.category).toBe('game');
      expect(metadata.developer).toBe('Studio');
    });

    it('should support ExternalMetadata union', () => {
      const movieMeta: ExternalMetadata = { category: 'movie', cast: [] };
      const bookMeta: ExternalMetadata = { category: 'book', authors: [] };
      const gameMeta: ExternalMetadata = { category: 'game', developer: 'Dev' };

      expect(movieMeta.category).toBe('movie');
      expect(bookMeta.category).toBe('book');
      expect(gameMeta.category).toBe('game');
    });
  });

  describe('CreateItemInput types', () => {
    it('should exclude id, createdAt, and updatedAt for NoteItem', () => {
      const input: CreateNoteItemInput = {
        title: 'New Note',
        type: 'note',
        sortOrder: 0,
        description: 'Note content',
      };

      expect(input.title).toBe('New Note');
      expect(input.type).toBe('note');
    });

    it('should exclude id, createdAt, and updatedAt for ShoppingItem', () => {
      const input: CreateShoppingItemInput = {
        title: 'New Shopping Item',
        type: 'shopping',
        sortOrder: 0,
        quantity: '1kg',
        price: 10.0,
        isChecked: false,
      };

      expect(input.title).toBe('New Shopping Item');
      expect(input.type).toBe('shopping');
      expect(input.quantity).toBe('1kg');
    });

    it('should support union type CreateItemInput', () => {
      const noteInput: CreateItemInput = {
        title: 'Note',
        type: 'note',
        sortOrder: 0,
      };

      const shoppingInput: CreateItemInput = {
        title: 'Shopping',
        type: 'shopping',
        sortOrder: 0,
      };

      expect(noteInput.type).toBe('note');
      expect(shoppingInput.type).toBe('shopping');
    });
  });

  describe('UpdateItemInput types', () => {
    it('should make all fields optional except type', () => {
      const fullUpdate: UpdateShoppingItemInput = {
        title: 'Updated Title',
        quantity: '2kg',
        price: 20.0,
        isChecked: true,
      };

      expect(fullUpdate.title).toBe('Updated Title');

      const partialUpdate: UpdateShoppingItemInput = {
        isChecked: true,
      };

      expect(partialUpdate.isChecked).toBe(true);
      expect(partialUpdate.title).toBeUndefined();
    });

    it('should support union type UpdateItemInput', () => {
      const update: UpdateItemInput = {
        title: 'Updated',
      };

      expect(update.title).toBe('Updated');
    });
  });

  describe('Entity traits composition', () => {
    it('should have Entity trait (id)', () => {
      const item: Item = {
        id: 'entity-id',
        title: 'Test',
        type: 'note',
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(typeof item.id).toBe('string');
    });

    it('should have Timestamped trait (createdAt, updatedAt)', () => {
      const now = new Date();
      const item: Item = {
        id: '1',
        title: 'Test',
        type: 'note',
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      };

      expect(item.createdAt).toBeInstanceOf(Date);
      expect(item.updatedAt).toBeInstanceOf(Date);
    });

    it('should have Sortable trait (sortOrder)', () => {
      const item: Item = {
        id: '1',
        title: 'Test',
        type: 'note',
        sortOrder: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(item.sortOrder).toBe(5);
    });
  });
});
