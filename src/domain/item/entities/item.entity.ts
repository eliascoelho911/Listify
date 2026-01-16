// Metadados base compartilhado por todas as categorias
type BaseMetadata = {
  coverUrl?: string;
  description?: string;
  releaseDate?: string;
  rating?: number;
};

// Metadados específicos por categoria de interesse
export type MovieMetadata = BaseMetadata & {
  category: 'movie';
  cast?: string[];
};

export type BookMetadata = BaseMetadata & {
  category: 'book';
  authors?: string[];
};

export type GameMetadata = BaseMetadata & {
  category: 'game';
  developer?: string;
};

export type ExternalMetadata = MovieMetadata | BookMetadata | GameMetadata;
export type MetadataCategory = ExternalMetadata['category'];

// Tipo base compartilhado por todos os itens
type BaseItem = {
  id: string;
  listId?: string;
  parentId?: string;
  title: string;
  tagIds: string[];
  isChecked?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Item de nota simples (com markdown)
export type NoteItem = BaseItem & {
  type: 'note';
  description?: string;
};

// Item de lista de compras
export type ShoppingItem = BaseItem & {
  type: 'shopping';
  quantity?: string;
  price?: number;
  sortOrder: number;
};

// Item de lista de interesse
export type InterestItem = BaseItem & {
  type: 'interest';
  externalId?: string;
  metadata?: ExternalMetadata;
};

// Union type principal
export type Item = NoteItem | ShoppingItem | InterestItem;
export type ItemType = Item['type'];

// Create input types
export type CreateNoteItemInput = Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateShoppingItemInput = Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateInterestItemInput = Omit<InterestItem, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateItemInput =
  | CreateNoteItemInput
  | CreateShoppingItemInput
  | CreateInterestItemInput;

// Update input types
export type UpdateNoteItemInput = Partial<Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt' | 'type'>>;
export type UpdateShoppingItemInput = Partial<Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt' | 'type'>>;
export type UpdateInterestItemInput = Partial<Omit<InterestItem, 'id' | 'createdAt' | 'updatedAt' | 'type'>>;

export type UpdateItemInput =
  | UpdateNoteItemInput
  | UpdateShoppingItemInput
  | UpdateInterestItemInput;
