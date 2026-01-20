import type {
  CreatePurchaseHistoryInput,
  PurchaseHistory,
  PurchaseHistoryItem,
  PurchaseHistorySection,
} from '@domain/purchase-history';
import type { CreatePurchaseHistoryRow, PurchaseHistoryRow } from '@data/persistence';

import {
  toCreatePurchaseHistoryRow,
  toDomainPurchaseHistory,
} from '@data/mappers/purchase-history.mapper';

describe('PurchaseHistory Mapper', () => {
  describe('toDomainPurchaseHistory', () => {
    it('should convert SQLite row to domain entity', () => {
      const sections: PurchaseHistorySection[] = [
        { originalSectionId: 's1', name: 'Padaria', sortOrder: 0 },
      ];

      const items: PurchaseHistoryItem[] = [
        {
          originalItemId: 'i1',
          sectionId: 's1',
          title: 'Pão',
          quantity: '1un',
          price: 5.0,
          sortOrder: 0,
          wasChecked: true,
        },
      ];

      const row: PurchaseHistoryRow = {
        id: 'uuid-123',
        list_id: 'list-uuid',
        purchase_date: 1704067200000, // 2024-01-01
        total_value: 150.5,
        sections: JSON.stringify(sections),
        items: JSON.stringify(items),
        created_at: 1704067200000,
        updated_at: 1704153600000,
      };

      const history = toDomainPurchaseHistory(row);

      expect(history.id).toBe('uuid-123');
      expect(history.listId).toBe('list-uuid');
      expect(history.purchaseDate).toBeInstanceOf(Date);
      expect(history.totalValue).toBe(150.5);
      expect(history.sections).toHaveLength(1);
      expect(history.sections[0].name).toBe('Padaria');
      expect(history.items).toHaveLength(1);
      expect(history.items[0].title).toBe('Pão');
      expect(history.createdAt).toBeInstanceOf(Date);
      expect(history.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle empty sections and items', () => {
      const row: PurchaseHistoryRow = {
        id: 'uuid-1',
        list_id: 'list-1',
        purchase_date: Date.now(),
        total_value: 0,
        sections: '[]',
        items: '[]',
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const history = toDomainPurchaseHistory(row);

      expect(history.sections).toEqual([]);
      expect(history.items).toEqual([]);
    });

    it('should parse complex items with optional fields', () => {
      const items: PurchaseHistoryItem[] = [
        { originalItemId: 'i1', title: 'Item 1', sortOrder: 0, wasChecked: true }, // minimal
        {
          originalItemId: 'i2',
          sectionId: 's1',
          title: 'Item 2',
          quantity: '2kg',
          price: 10,
          sortOrder: 1,
          wasChecked: true,
        },
        { originalItemId: 'i3', title: 'Skipped Item', sortOrder: 2, wasChecked: false },
      ];

      const row: PurchaseHistoryRow = {
        id: 'uuid-1',
        list_id: 'list-1',
        purchase_date: Date.now(),
        total_value: 10,
        sections: '[]',
        items: JSON.stringify(items),
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const history = toDomainPurchaseHistory(row);

      expect(history.items).toHaveLength(3);
      expect(history.items[0].sectionId).toBeUndefined();
      expect(history.items[0].quantity).toBeUndefined();
      expect(history.items[1].quantity).toBe('2kg');
      expect(history.items[2].wasChecked).toBe(false);
    });
  });

  describe('toCreatePurchaseHistoryRow', () => {
    it('should convert domain input to SQLite row', () => {
      const sections: PurchaseHistorySection[] = [
        { originalSectionId: 's1', name: 'Laticínios', sortOrder: 0 },
      ];

      const items: PurchaseHistoryItem[] = [
        {
          originalItemId: 'i1',
          sectionId: 's1',
          title: 'Leite',
          quantity: '2L',
          price: 8.5,
          sortOrder: 0,
          wasChecked: true,
        },
      ];

      const input: CreatePurchaseHistoryInput = {
        listId: 'list-1',
        purchaseDate: new Date('2024-01-15'),
        totalValue: 100.5,
        sections,
        items,
      };
      const id = 'generated-uuid';

      const row = toCreatePurchaseHistoryRow(input, id);

      expect(row.id).toBe('generated-uuid');
      expect(row.list_id).toBe('list-1');
      expect(typeof row.purchase_date).toBe('number');
      expect(row.total_value).toBe(100.5);
      expect(row.sections).toBe(JSON.stringify(sections));
      expect(row.items).toBe(JSON.stringify(items));
      expect(typeof row.created_at).toBe('number');
      expect(typeof row.updated_at).toBe('number');
    });

    it('should convert Date to timestamp', () => {
      const purchaseDate = new Date('2024-01-15T10:30:00Z');

      const input: CreatePurchaseHistoryInput = {
        listId: 'list-1',
        purchaseDate,
        totalValue: 50,
        sections: [],
        items: [],
      };

      const row = toCreatePurchaseHistoryRow(input, 'uuid');

      expect(row.purchase_date).toBe(purchaseDate.getTime());
    });

    it('should stringify sections and items arrays', () => {
      const sections: PurchaseHistorySection[] = [
        { originalSectionId: 's1', name: 'Section 1', sortOrder: 0 },
        { originalSectionId: 's2', name: 'Section 2', sortOrder: 1 },
      ];

      const items: PurchaseHistoryItem[] = [
        { originalItemId: 'i1', title: 'Item 1', sortOrder: 0, wasChecked: true },
        { originalItemId: 'i2', title: 'Item 2', sortOrder: 1, wasChecked: false },
      ];

      const input: CreatePurchaseHistoryInput = {
        listId: 'list-1',
        purchaseDate: new Date(),
        totalValue: 0,
        sections,
        items,
      };

      const row = toCreatePurchaseHistoryRow(input, 'uuid');

      expect(typeof row.sections).toBe('string');
      expect(typeof row.items).toBe('string');
      expect(JSON.parse(row.sections)).toEqual(sections);
      expect(JSON.parse(row.items)).toEqual(items);
    });
  });

  describe('roundtrip conversion', () => {
    it('should maintain data integrity through create and read', () => {
      const sections: PurchaseHistorySection[] = [
        { originalSectionId: 's1', name: 'Padaria', sortOrder: 0 },
        { originalSectionId: 's2', name: 'Laticínios', sortOrder: 1 },
      ];

      const items: PurchaseHistoryItem[] = [
        {
          originalItemId: 'i1',
          sectionId: 's1',
          title: 'Pão',
          quantity: '1un',
          price: 5,
          sortOrder: 0,
          wasChecked: true,
        },
        {
          originalItemId: 'i2',
          sectionId: 's2',
          title: 'Leite',
          quantity: '2L',
          price: 8.5,
          sortOrder: 1,
          wasChecked: true,
        },
        { originalItemId: 'i3', title: 'Skipped', sortOrder: 2, wasChecked: false },
      ];

      const purchaseDate = new Date('2024-01-15T10:30:00Z');

      const input: CreatePurchaseHistoryInput = {
        listId: 'roundtrip-list',
        purchaseDate,
        totalValue: 250.75,
        sections,
        items,
      };
      const id = 'roundtrip-uuid';

      const createRow = toCreatePurchaseHistoryRow(input, id);

      const readRow: PurchaseHistoryRow = {
        id: createRow.id,
        list_id: createRow.list_id,
        purchase_date: createRow.purchase_date,
        total_value: createRow.total_value,
        sections: createRow.sections,
        items: createRow.items,
        created_at: createRow.created_at,
        updated_at: createRow.updated_at,
      };

      const history = toDomainPurchaseHistory(readRow);

      expect(history.id).toBe(id);
      expect(history.listId).toBe(input.listId);
      expect(history.purchaseDate.getTime()).toBe(purchaseDate.getTime());
      expect(history.totalValue).toBe(input.totalValue);
      expect(history.sections).toEqual(sections);
      expect(history.items).toEqual(items);
    });
  });
});
