import type {
  CreatePurchaseHistoryInput,
  PurchaseHistory,
  PurchaseHistoryItem,
  PurchaseHistorySection,
} from '@domain/purchase-history';

describe('PurchaseHistory Entity', () => {
  describe('PurchaseHistory type structure', () => {
    it('should have correct shape', () => {
      const history: PurchaseHistory = {
        id: 'uuid-1',
        listId: 'list-uuid',
        purchaseDate: new Date('2024-01-15'),
        totalValue: 150.5,
        sections: [],
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(history.id).toBe('uuid-1');
      expect(history.listId).toBe('list-uuid');
      expect(history.purchaseDate).toBeInstanceOf(Date);
      expect(history.totalValue).toBe(150.5);
      expect(history.sections).toEqual([]);
      expect(history.items).toEqual([]);
    });

    it('should require listId (history is bound to shopping list)', () => {
      const history: PurchaseHistory = {
        id: '1',
        listId: 'required-list-id',
        purchaseDate: new Date(),
        totalValue: 100,
        sections: [],
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(history.listId).toBeDefined();
    });
  });

  describe('PurchaseHistorySection type', () => {
    it('should have correct shape', () => {
      const section: PurchaseHistorySection = {
        originalSectionId: 'section-uuid',
        name: 'Padaria',
        sortOrder: 0,
      };

      expect(section.originalSectionId).toBe('section-uuid');
      expect(section.name).toBe('Padaria');
      expect(section.sortOrder).toBe(0);
    });
  });

  describe('PurchaseHistoryItem type', () => {
    it('should have correct shape for checked item', () => {
      const item: PurchaseHistoryItem = {
        originalItemId: 'item-uuid',
        sectionId: 'section-uuid',
        title: 'Leite',
        quantity: '2L',
        price: 8.5,
        sortOrder: 0,
        wasChecked: true,
      };

      expect(item.originalItemId).toBe('item-uuid');
      expect(item.title).toBe('Leite');
      expect(item.quantity).toBe('2L');
      expect(item.price).toBe(8.5);
      expect(item.wasChecked).toBe(true);
    });

    it('should have correct shape for unchecked item', () => {
      const item: PurchaseHistoryItem = {
        originalItemId: 'item-uuid-2',
        title: 'Pão',
        sortOrder: 1,
        wasChecked: false,
      };

      expect(item.wasChecked).toBe(false);
      expect(item.sectionId).toBeUndefined();
      expect(item.quantity).toBeUndefined();
      expect(item.price).toBeUndefined();
    });

    it('should allow optional sectionId', () => {
      const itemWithSection: PurchaseHistoryItem = {
        originalItemId: '1',
        sectionId: 'section-1',
        title: 'Item with section',
        sortOrder: 0,
        wasChecked: true,
      };

      expect(itemWithSection.sectionId).toBeDefined();

      const itemWithoutSection: PurchaseHistoryItem = {
        originalItemId: '2',
        title: 'Item without section',
        sortOrder: 0,
        wasChecked: false,
      };

      expect(itemWithoutSection.sectionId).toBeUndefined();
    });
  });

  describe('PurchaseHistory with sections and items', () => {
    it('should contain snapshot of sections and items', () => {
      const history: PurchaseHistory = {
        id: 'history-1',
        listId: 'shopping-list-1',
        purchaseDate: new Date('2024-01-20'),
        totalValue: 250.75,
        sections: [
          { originalSectionId: 's1', name: 'Padaria', sortOrder: 0 },
          { originalSectionId: 's2', name: 'Laticínios', sortOrder: 1 },
        ],
        items: [
          {
            originalItemId: 'i1',
            sectionId: 's1',
            title: 'Pão',
            quantity: '1un',
            price: 5.0,
            sortOrder: 0,
            wasChecked: true,
          },
          {
            originalItemId: 'i2',
            sectionId: 's2',
            title: 'Leite',
            quantity: '2L',
            price: 12.0,
            sortOrder: 1,
            wasChecked: true,
          },
          {
            originalItemId: 'i3',
            title: 'Biscoito',
            sortOrder: 2,
            wasChecked: false,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(history.sections).toHaveLength(2);
      expect(history.items).toHaveLength(3);
      expect(history.items.filter((i) => i.wasChecked)).toHaveLength(2);
    });
  });

  describe('CreatePurchaseHistoryInput type', () => {
    it('should exclude id, createdAt, and updatedAt', () => {
      const input: CreatePurchaseHistoryInput = {
        listId: 'list-1',
        purchaseDate: new Date(),
        totalValue: 100,
        sections: [],
        items: [],
      };

      expect(input.listId).toBe('list-1');
      expect(input.totalValue).toBe(100);
    });
  });

  describe('Entity traits composition', () => {
    it('should have Entity trait (id)', () => {
      const history: PurchaseHistory = {
        id: 'entity-id',
        listId: 'list-1',
        purchaseDate: new Date(),
        totalValue: 0,
        sections: [],
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(typeof history.id).toBe('string');
    });

    it('should have Timestamped trait (createdAt, updatedAt)', () => {
      const now = new Date();
      const history: PurchaseHistory = {
        id: '1',
        listId: 'list-1',
        purchaseDate: now,
        totalValue: 0,
        sections: [],
        items: [],
        createdAt: now,
        updatedAt: now,
      };

      expect(history.createdAt).toBeInstanceOf(Date);
      expect(history.updatedAt).toBeInstanceOf(Date);
    });
  });
});
