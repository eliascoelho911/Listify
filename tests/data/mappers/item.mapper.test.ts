import type {
  CreateNoteItemInput,
  CreateShoppingItemInput,
  Item,
  MovieMetadata,
  NoteItem,
  ShoppingItem,
} from '@domain/item';
import type { CreateItemRow, ItemRow, UpdateItemRow } from '@data/persistence';

import {
  toCreateItemRow,
  toDomainItem,
  toDomainNoteItem,
  toDomainShoppingItem,
  toUpdateItemRow,
} from '@data/mappers/item.mapper';

describe('Item Mapper', () => {
  describe('toDomainItem', () => {
    it('should convert NoteItem row to domain entity', () => {
      const row: ItemRow = {
        id: 'note-1',
        list_id: 'list-1',
        section_id: null,
        title: 'My Note',
        type: 'note',
        sort_order: 0,
        description: 'Note content',
        quantity: null,
        price: null,
        is_checked: null,
        external_id: null,
        metadata: null,
        created_at: 1704067200000,
        updated_at: 1704153600000,
      };

      const item = toDomainItem(row);

      expect(item.id).toBe('note-1');
      expect(item.listId).toBe('list-1');
      expect(item.title).toBe('My Note');
      expect(item.type).toBe('note');
      if (item.type === 'note') {
        expect(item.description).toBe('Note content');
      }
    });

    it('should convert ShoppingItem row to domain entity', () => {
      const row: ItemRow = {
        id: 'shopping-1',
        list_id: 'list-1',
        section_id: 'section-1',
        title: 'Milk',
        type: 'shopping',
        sort_order: 1,
        description: null,
        quantity: '2L',
        price: 8.5,
        is_checked: 1,
        external_id: null,
        metadata: null,
        created_at: 1704067200000,
        updated_at: 1704153600000,
      };

      const item = toDomainItem(row);

      expect(item.type).toBe('shopping');
      if (item.type === 'shopping') {
        expect(item.quantity).toBe('2L');
        expect(item.price).toBe(8.5);
        expect(item.isChecked).toBe(true);
      }
    });

    it('should convert MovieItem row with metadata', () => {
      const metadata: MovieMetadata = {
        category: 'movie',
        coverUrl: 'https://example.com/poster.jpg',
        description: 'A great movie',
        rating: 8.5,
        cast: ['Actor 1', 'Actor 2'],
      };

      const row: ItemRow = {
        id: 'movie-1',
        list_id: 'list-1',
        section_id: null,
        title: 'Inception',
        type: 'movie',
        sort_order: 0,
        description: null,
        quantity: null,
        price: null,
        is_checked: 0,
        external_id: 'tmdb-123',
        metadata: JSON.stringify(metadata),
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const item = toDomainItem(row);

      expect(item.type).toBe('movie');
      if (item.type === 'movie') {
        expect(item.externalId).toBe('tmdb-123');
        expect(item.metadata?.category).toBe('movie');
        expect(item.metadata?.cast).toContain('Actor 1');
      }
    });

    it('should handle null list_id (Inbox item)', () => {
      const row: ItemRow = {
        id: 'inbox-1',
        list_id: null,
        section_id: null,
        title: 'Quick note',
        type: 'note',
        sort_order: 0,
        description: null,
        quantity: null,
        price: null,
        is_checked: null,
        external_id: null,
        metadata: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const item = toDomainItem(row);

      expect(item.listId).toBeUndefined();
    });

    it('should convert is_checked to boolean', () => {
      const checkedRow: ItemRow = {
        id: '1',
        list_id: 'list',
        section_id: null,
        title: 'Checked',
        type: 'shopping',
        sort_order: 0,
        description: null,
        quantity: null,
        price: null,
        is_checked: 1,
        external_id: null,
        metadata: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const uncheckedRow: ItemRow = {
        ...checkedRow,
        id: '2',
        title: 'Unchecked',
        is_checked: 0,
      };

      const checked = toDomainItem(checkedRow);
      const unchecked = toDomainItem(uncheckedRow);

      if (checked.type === 'shopping' && unchecked.type === 'shopping') {
        expect(checked.isChecked).toBe(true);
        expect(unchecked.isChecked).toBe(false);
      }
    });
  });

  describe('toDomainNoteItem', () => {
    it('should convert row to NoteItem specifically', () => {
      const row: ItemRow = {
        id: 'note-1',
        list_id: 'list-1',
        section_id: null,
        title: 'Note Title',
        type: 'note',
        sort_order: 0,
        description: 'Note description',
        quantity: null,
        price: null,
        is_checked: null,
        external_id: null,
        metadata: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const note: NoteItem = toDomainNoteItem(row);

      expect(note.type).toBe('note');
      expect(note.description).toBe('Note description');
    });
  });

  describe('toDomainShoppingItem', () => {
    it('should convert row to ShoppingItem specifically', () => {
      const row: ItemRow = {
        id: 'shopping-1',
        list_id: 'list-1',
        section_id: 'section-1',
        title: 'Bread',
        type: 'shopping',
        sort_order: 0,
        description: null,
        quantity: '1un',
        price: 5.0,
        is_checked: 1,
        external_id: null,
        metadata: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const item: ShoppingItem = toDomainShoppingItem(row);

      expect(item.type).toBe('shopping');
      expect(item.quantity).toBe('1un');
      expect(item.price).toBe(5.0);
      expect(item.isChecked).toBe(true);
    });
  });

  describe('toCreateItemRow', () => {
    it('should convert NoteItem input to row', () => {
      const input: CreateNoteItemInput = {
        listId: 'list-1',
        title: 'New Note',
        type: 'note',
        sortOrder: 0,
        description: 'Note content',
      };

      const row = toCreateItemRow(input, 'note-uuid');

      expect(row.id).toBe('note-uuid');
      expect(row.list_id).toBe('list-1');
      expect(row.title).toBe('New Note');
      expect(row.type).toBe('note');
      expect(row.description).toBe('Note content');
    });

    it('should convert ShoppingItem input to row', () => {
      const input: CreateShoppingItemInput = {
        listId: 'list-1',
        sectionId: 'section-1',
        title: 'Milk',
        type: 'shopping',
        sortOrder: 1,
        quantity: '2L',
        price: 8.5,
        isChecked: false,
      };

      const row = toCreateItemRow(input, 'shopping-uuid');

      expect(row.list_id).toBe('list-1');
      expect(row.section_id).toBe('section-1');
      expect(row.quantity).toBe('2L');
      expect(row.price).toBe(8.5);
      expect(row.is_checked).toBe(0);
    });

    it('should convert isChecked true to 1', () => {
      const input: CreateShoppingItemInput = {
        title: 'Test',
        type: 'shopping',
        sortOrder: 0,
        isChecked: true,
      };

      const row = toCreateItemRow(input, 'uuid');

      expect(row.is_checked).toBe(1);
    });

    it('should handle undefined optional fields', () => {
      const input: CreateNoteItemInput = {
        title: 'Minimal Note',
        type: 'note',
        sortOrder: 0,
      };

      const row = toCreateItemRow(input, 'uuid');

      expect(row.list_id).toBeNull();
      expect(row.section_id).toBeNull();
      expect(row.description).toBeNull();
    });
  });

  describe('toUpdateItemRow', () => {
    it('should convert partial update to row', () => {
      const updates = {
        title: 'Updated Title',
        isChecked: true,
      };

      const row = toUpdateItemRow(updates);

      expect(row.title).toBe('Updated Title');
      expect(row.is_checked).toBe(1);
      expect(typeof row.updated_at).toBe('number');
    });

    it('should handle price and quantity updates', () => {
      const updates = {
        price: 15.99,
        quantity: '3kg',
      };

      const row = toUpdateItemRow(updates);

      expect(row.price).toBe(15.99);
      expect(row.quantity).toBe('3kg');
    });

    it('should always set updated_at', () => {
      const before = Date.now();
      const row = toUpdateItemRow({});
      const after = Date.now();

      expect(row.updated_at).toBeGreaterThanOrEqual(before);
      expect(row.updated_at).toBeLessThanOrEqual(after);
    });
  });
});
