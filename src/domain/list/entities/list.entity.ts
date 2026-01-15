export type ListCategory = 'interest' | 'shopping';

export type InterestListType = 'movies' | 'books' | 'games' | 'custom';
export type ShoppingListType = 'shopping';

export type ListType = InterestListType | ShoppingListType;

export type ListTypeConfig =
  | { category: 'interest'; listType: InterestListType }
  | { category: 'shopping'; listType: ShoppingListType };

export type List = ListTypeConfig & {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateListInput = Omit<List, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateListInput = Partial<Omit<List, 'id' | 'createdAt'>>;
