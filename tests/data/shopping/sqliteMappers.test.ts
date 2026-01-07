import {
  mapCategoryEntityToRow,
  mapCategoryRowToEntity,
  mapItemEntityToRow,
  mapItemRowToEntity,
  mapListRowToEntity,
} from '@data/shopping/mappers/sqliteMappers';
import { Quantity } from '@domain/shopping/value-objects/Quantity';

describe('sqlite mappers', () => {
  it('maps ShoppingList row to entity', () => {
    const row = {
      id: 'list-1',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-02T00:00:00.000Z',
      currency_code: 'BRL',
      is_completed: 1,
      completed_at: '2024-01-03T00:00:00.000Z',
      hide_purchased_by_default: 1,
      ask_price_on_purchase: 0,
    };

    const entity = mapListRowToEntity(row);
    expect(entity.id).toBe('list-1');
    expect(entity.isCompleted).toBe(true);
    expect(entity.completedAt?.toISOString()).toBe(row.completed_at);
    expect(entity.currencyCode).toBe('BRL');
  });

  it('maps Category row to entity and back', () => {
    const row = {
      id: 'cat-1',
      name: 'hortifruti',
      is_predefined: 1,
      sort_order: 2,
    };

    const entity = mapCategoryRowToEntity(row);
    expect(entity).toEqual({
      id: 'cat-1',
      name: 'hortifruti',
      isPredefined: true,
      sortOrder: 2,
    });

    const back = mapCategoryEntityToRow(entity);
    expect(back).toEqual(row);
  });

  it('maps Item row to entity and back preserving quantity/unit/status', () => {
    const row = {
      id: 'item-1',
      list_id: 'list-1',
      name: 'Maçã',
      quantity_num: '0.5',
      unit: 'kg',
      category_id: 'cat-1',
      status: 'purchased',
      position: 3,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-02T00:00:00.000Z',
      purchased_at: '2024-01-03T00:00:00.000Z',
      unit_price_minor: 1000,
      total_price_minor: 500,
    };

    const entity = mapItemRowToEntity(row);
    expect(entity.quantity.toString()).toBe('0.5');
    expect(entity.unit).toBe('kg');
    expect(entity.status).toBe('purchased');
    expect(entity.totalPriceMinor).toBe(500);
    expect(entity.purchasedAt?.toISOString()).toBe(row.purchased_at);

    const back = mapItemEntityToRow(entity);
    expect(back.quantity_num).toBe('0.5');
    expect(back.status).toBe('purchased');
    expect(back.unit_price_minor).toBe(1000);
    expect(back.total_price_minor).toBe(500);
  });

  it('maps Item entity with optional fields empty to row with nulls', () => {
    const entity = {
      id: 'item-2',
      listId: 'list-1',
      name: 'Laranja',
      quantity: Quantity.parse('1'),
      unit: 'un',
      categoryId: 'cat-1',
      status: 'pending' as const,
      position: 1,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    const row = mapItemEntityToRow(entity);
    expect(row.purchased_at).toBeNull();
    expect(row.unit_price_minor).toBeNull();
    expect(row.total_price_minor).toBeNull();
  });
});
