import type { Quantity } from '../value-objects/Quantity';
import type { UnitCode } from '../value-objects/Unit';

export type ShoppingItemStatus = 'pending' | 'purchased';

export type ShoppingItem = {
  id: string;
  listId: string;
  name: string;
  quantity: Quantity;
  unit: UnitCode;
  categoryId: string;
  status: ShoppingItemStatus;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  purchasedAt?: Date;
  unitPriceMinor?: number;
  totalPriceMinor?: number;
};
