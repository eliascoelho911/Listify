export type ShoppingList = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  currencyCode: string;
  isCompleted: boolean;
  completedAt?: Date;
  hidePurchasedByDefault: boolean;
  askPriceOnPurchase: boolean;
};
