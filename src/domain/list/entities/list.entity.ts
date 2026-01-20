type BaseList = {
  id: string;
  name: string;
  description?: string;
  isPrefabricated: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type NotesList = BaseList & { listType: 'notes' };
export type ShoppingList = BaseList & { listType: 'shopping' };
export type MoviesList = BaseList & { listType: 'movies' };
export type BooksList = BaseList & { listType: 'books' };
export type GamesList = BaseList & { listType: 'games' };

export type List = NotesList | ShoppingList | MoviesList | BooksList | GamesList;
export type ListType = List['listType'];

export type CreateListInput = Omit<List, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateListInput = Partial<Omit<List, 'id' | 'createdAt'>>;
