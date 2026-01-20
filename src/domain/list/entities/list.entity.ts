export type ListCategory = 'notes' | 'interest' | 'shopping';

export type NotesListType = 'notes';
export type InterestListType = 'movies' | 'books' | 'games';
export type ShoppingListType = 'shopping';

export type ListType = NotesListType | InterestListType | ShoppingListType;

export type ListTypeConfig =
  | { category: 'notes'; listType: NotesListType }
  | { category: 'interest'; listType: InterestListType }
  | { category: 'shopping'; listType: ShoppingListType };

export type List = ListTypeConfig & {
  id: string;
  name: string;
  description?: string;
  isPrefabricated: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateListInput = Omit<List, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateListInput = Partial<Omit<List, 'id' | 'createdAt'>>;
