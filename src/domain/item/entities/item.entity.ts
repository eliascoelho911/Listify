import type { Sortable } from '@domain/common';

// Base metadata shared by all interest categories
type BaseMetadata = {
  coverUrl?: string;
  description?: string;
  releaseDate?: string;
  rating?: number;
};

// Category-specific metadata
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

// Base type shared by all items
type BaseItem = Sortable & {
  id: string;
  listId?: string;
  sectionId?: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

// Note item (simple with markdown)
export type NoteItem = BaseItem & {
  type: 'note';
  description?: string;
};

// Shopping list item
export type ShoppingItem = BaseItem & {
  type: 'shopping';
  quantity?: string;
  price?: number;
  isChecked?: boolean;
};

// Movie list item
export type MovieItem = BaseItem & {
  type: 'movie';
  externalId?: string;
  metadata?: MovieMetadata;
  isChecked?: boolean;
};

// Book list item
export type BookItem = BaseItem & {
  type: 'book';
  externalId?: string;
  metadata?: BookMetadata;
  isChecked?: boolean;
};

// Game list item
export type GameItem = BaseItem & {
  type: 'game';
  externalId?: string;
  metadata?: GameMetadata;
  isChecked?: boolean;
};

// Main union type
export type Item = NoteItem | ShoppingItem | MovieItem | BookItem | GameItem;
export type ItemType = Item['type'];

// Create input types
export type CreateNoteItemInput = Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateShoppingItemInput = Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateMovieItemInput = Omit<MovieItem, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateBookItemInput = Omit<BookItem, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateGameItemInput = Omit<GameItem, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateItemInput =
  | CreateNoteItemInput
  | CreateShoppingItemInput
  | CreateMovieItemInput
  | CreateBookItemInput
  | CreateGameItemInput;

// Update input types
export type UpdateNoteItemInput = Partial<
  Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt' | 'type'>
>;
export type UpdateShoppingItemInput = Partial<
  Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt' | 'type'>
>;
export type UpdateMovieItemInput = Partial<
  Omit<MovieItem, 'id' | 'createdAt' | 'updatedAt' | 'type'>
>;
export type UpdateBookItemInput = Partial<
  Omit<BookItem, 'id' | 'createdAt' | 'updatedAt' | 'type'>
>;
export type UpdateGameItemInput = Partial<
  Omit<GameItem, 'id' | 'createdAt' | 'updatedAt' | 'type'>
>;

export type UpdateItemInput =
  | UpdateNoteItemInput
  | UpdateShoppingItemInput
  | UpdateMovieItemInput
  | UpdateBookItemInput
  | UpdateGameItemInput;
