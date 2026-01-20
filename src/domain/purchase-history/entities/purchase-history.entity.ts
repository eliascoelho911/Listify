import type { Entity, Timestamped } from '@domain/common';

export type PurchaseHistorySection = {
  originalSectionId: string;
  name: string;
  sortOrder: number;
};

export type PurchaseHistoryItem = {
  originalItemId: string;
  sectionId?: string;
  title: string;
  quantity?: string;
  price?: number;
  sortOrder: number;
  wasChecked: boolean;
};

export type PurchaseHistory = Entity &
  Timestamped & {
    listId: string;
    purchaseDate: Date;
    totalValue: number;
    sections: PurchaseHistorySection[];
    items: PurchaseHistoryItem[];
  };

export type CreatePurchaseHistoryInput = Omit<PurchaseHistory, 'id' | 'createdAt' | 'updatedAt'>;
