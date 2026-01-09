import { DEFAULT_CURRENCY_CODE } from '@domain/shopping/constants';
import type { ShoppingList } from '@domain/shopping/entities/ShoppingList';

import { createInMemoryRepository, createShoppingList } from './testUtils';

describe('ShoppingList States', () => {
  describe('Active List State', () => {
    it('creates list with isCompleted false by default', () => {
      const list = createShoppingList();

      expect(list.isCompleted).toBe(false);
      expect(list.completedAt).toBeUndefined();
    });

    it('active list has no completedAt timestamp', () => {
      const list = createShoppingList({ isCompleted: false });

      expect(list.completedAt).toBeUndefined();
    });

    it('maintains consistent state for active list', () => {
      const list: ShoppingList = {
        id: 'list-active',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        currencyCode: DEFAULT_CURRENCY_CODE,
        isCompleted: false,
        hidePurchasedByDefault: false,
        askPriceOnPurchase: false,
      };

      expect(list.isCompleted).toBe(false);
      expect(list.completedAt).toBeUndefined();
    });
  });

  describe('Completed List State', () => {
    it('creates completed list with timestamp', () => {
      const completedAt = new Date('2024-01-10T15:30:00.000Z');
      const list = createShoppingList({
        isCompleted: true,
        completedAt,
      });

      expect(list.isCompleted).toBe(true);
      expect(list.completedAt).toBe(completedAt);
    });

    it('maintains consistent state for completed list', () => {
      const completedAt = new Date('2024-01-10T15:30:00.000Z');
      const list: ShoppingList = {
        id: 'list-completed',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-10T15:30:00.000Z'),
        currencyCode: DEFAULT_CURRENCY_CODE,
        isCompleted: true,
        completedAt,
        hidePurchasedByDefault: true,
        askPriceOnPurchase: false,
      };

      expect(list.isCompleted).toBe(true);
      expect(list.completedAt).toBeDefined();
      expect(list.completedAt?.toISOString()).toBe(completedAt.toISOString());
    });

    it('completed list can have undefined completedAt for legacy data', () => {
      const list = createShoppingList({
        isCompleted: true,
        completedAt: undefined,
      });

      expect(list.isCompleted).toBe(true);
      expect(list.completedAt).toBeUndefined();
    });
  });

  describe('List Preferences', () => {
    it('creates list with hidePurchasedByDefault false by default', () => {
      const list = createShoppingList();

      expect(list.hidePurchasedByDefault).toBe(false);
    });

    it('creates list with askPriceOnPurchase false by default', () => {
      const list = createShoppingList();

      expect(list.askPriceOnPurchase).toBe(false);
    });

    it('allows customizing hidePurchasedByDefault', () => {
      const list = createShoppingList({ hidePurchasedByDefault: true });

      expect(list.hidePurchasedByDefault).toBe(true);
    });

    it('allows customizing askPriceOnPurchase', () => {
      const list = createShoppingList({ askPriceOnPurchase: true });

      expect(list.askPriceOnPurchase).toBe(true);
    });

    it('maintains both preferences independently', () => {
      const list = createShoppingList({
        hidePurchasedByDefault: true,
        askPriceOnPurchase: false,
      });

      expect(list.hidePurchasedByDefault).toBe(true);
      expect(list.askPriceOnPurchase).toBe(false);
    });
  });

  describe('List Metadata', () => {
    it('creates list with valid timestamps', () => {
      const now = new Date('2024-01-01T00:00:00.000Z');
      const list = createShoppingList({
        createdAt: now,
        updatedAt: now,
      });

      expect(list.createdAt).toBe(now);
      expect(list.updatedAt).toBe(now);
    });

    it('creates list with default currency code', () => {
      const list = createShoppingList();

      expect(list.currencyCode).toBe(DEFAULT_CURRENCY_CODE);
    });

    it('allows customizing currency code', () => {
      const list = createShoppingList({ currencyCode: 'USD' });

      expect(list.currencyCode).toBe('USD');
    });

    it('creates list with unique id', () => {
      const list1 = createShoppingList({ id: 'list-1' });
      const list2 = createShoppingList({ id: 'list-2' });

      expect(list1.id).not.toBe(list2.id);
    });
  });

  describe('Repository Integration', () => {
    it('retrieves active list from repository', async () => {
      const repository = createInMemoryRepository({
        list: createShoppingList({ isCompleted: false }),
      });

      const list = await repository.getActiveList();

      expect(list.isCompleted).toBe(false);
      expect(list.completedAt).toBeUndefined();
    });

    it('retrieves completed list from repository', async () => {
      const completedAt = new Date('2024-01-15T10:00:00.000Z');
      const repository = createInMemoryRepository({
        list: createShoppingList({
          isCompleted: true,
          completedAt,
        }),
      });

      const list = await repository.getActiveList();

      expect(list.isCompleted).toBe(true);
      expect(list.completedAt).toBeDefined();
    });

    it('retrieves list with preferences from repository', async () => {
      const repository = createInMemoryRepository({
        list: createShoppingList({
          hidePurchasedByDefault: true,
          askPriceOnPurchase: true,
        }),
      });

      const list = await repository.getActiveList();

      expect(list.hidePurchasedByDefault).toBe(true);
      expect(list.askPriceOnPurchase).toBe(true);
    });
  });

  describe('State Transitions', () => {
    it('handles transition from active to completed state', () => {
      const activeList = createShoppingList({
        isCompleted: false,
        completedAt: undefined,
      });

      const completedAt = new Date('2024-01-20T12:00:00.000Z');
      const completedList: ShoppingList = {
        ...activeList,
        isCompleted: true,
        completedAt,
        updatedAt: completedAt,
      };

      expect(activeList.isCompleted).toBe(false);
      expect(completedList.isCompleted).toBe(true);
      expect(completedList.completedAt).toBe(completedAt);
    });

    it('handles transition from completed to active state', () => {
      const completedList = createShoppingList({
        isCompleted: true,
        completedAt: new Date('2024-01-20T12:00:00.000Z'),
      });

      const activeList: ShoppingList = {
        ...completedList,
        isCompleted: false,
        completedAt: undefined,
        updatedAt: new Date('2024-01-21T10:00:00.000Z'),
      };

      expect(completedList.isCompleted).toBe(true);
      expect(activeList.isCompleted).toBe(false);
      expect(activeList.completedAt).toBeUndefined();
    });

    it('preserves other properties during state transitions', () => {
      const originalList = createShoppingList({
        id: 'list-preserve',
        currencyCode: 'EUR',
        hidePurchasedByDefault: true,
        askPriceOnPurchase: true,
        isCompleted: false,
      });

      const transitionedList: ShoppingList = {
        ...originalList,
        isCompleted: true,
        completedAt: new Date(),
      };

      expect(transitionedList.id).toBe(originalList.id);
      expect(transitionedList.currencyCode).toBe(originalList.currencyCode);
      expect(transitionedList.hidePurchasedByDefault).toBe(originalList.hidePurchasedByDefault);
      expect(transitionedList.askPriceOnPurchase).toBe(originalList.askPriceOnPurchase);
    });
  });

  describe('Edge Cases', () => {
    it('handles list with all preferences enabled', () => {
      const list = createShoppingList({
        hidePurchasedByDefault: true,
        askPriceOnPurchase: true,
        isCompleted: true,
        completedAt: new Date(),
      });

      expect(list.hidePurchasedByDefault).toBe(true);
      expect(list.askPriceOnPurchase).toBe(true);
      expect(list.isCompleted).toBe(true);
      expect(list.completedAt).toBeDefined();
    });

    it('handles list with all preferences disabled', () => {
      const list = createShoppingList({
        hidePurchasedByDefault: false,
        askPriceOnPurchase: false,
        isCompleted: false,
      });

      expect(list.hidePurchasedByDefault).toBe(false);
      expect(list.askPriceOnPurchase).toBe(false);
      expect(list.isCompleted).toBe(false);
      expect(list.completedAt).toBeUndefined();
    });

    it('handles list with very old createdAt date', () => {
      const oldDate = new Date('2020-01-01T00:00:00.000Z');
      const list = createShoppingList({
        createdAt: oldDate,
        updatedAt: new Date(),
      });

      expect(list.createdAt).toBe(oldDate);
      expect(list.updatedAt.getTime()).toBeGreaterThan(oldDate.getTime());
    });

    it('handles list with createdAt equal to updatedAt', () => {
      const now = new Date('2024-01-01T12:00:00.000Z');
      const list = createShoppingList({
        createdAt: now,
        updatedAt: now,
      });

      expect(list.createdAt.getTime()).toBe(list.updatedAt.getTime());
    });

    it('handles list with different currency codes', () => {
      const currencies = ['BRL', 'USD', 'EUR', 'GBP', 'JPY'];

      currencies.forEach((currency) => {
        const list = createShoppingList({ currencyCode: currency });
        expect(list.currencyCode).toBe(currency);
      });
    });
  });
});
