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

export type PurchaseHistory = {
  id: string;
  listId: string;
  purchaseDate: Date;
  totalValue: number;
  sections: PurchaseHistorySection[];
  items: PurchaseHistoryItem[];
  createdAt: Date;
};

export type CreatePurchaseHistoryInput = Omit<PurchaseHistory, 'id' | 'createdAt'>;
