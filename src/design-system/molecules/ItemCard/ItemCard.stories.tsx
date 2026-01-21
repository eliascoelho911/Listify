/**
 * ItemCard Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import type {
  BookItem,
  GameItem,
  MovieItem,
  NoteItem,
  ShoppingItem,
} from '@domain/item/entities/item.entity';

import { ThemeProvider } from '../../theme';
import { ItemCard } from './ItemCard';

const now = new Date();
const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

const mockNoteItem: NoteItem = {
  id: '1',
  type: 'note',
  title: 'Meeting notes from today',
  description:
    'Discussed the new feature implementation and timeline for delivery. Need to follow up with the team.',
  sortOrder: 0,
  createdAt: hourAgo,
  updatedAt: hourAgo,
};

const mockShoppingItem: ShoppingItem = {
  id: '2',
  type: 'shopping',
  title: 'Milk',
  quantity: '2L',
  price: 8.99,
  isChecked: false,
  sortOrder: 1,
  listId: 'list-1',
  createdAt: hourAgo,
  updatedAt: hourAgo,
};

const mockShoppingItemChecked: ShoppingItem = {
  id: '3',
  type: 'shopping',
  title: 'Bread',
  quantity: '1 unit',
  price: 5.5,
  isChecked: true,
  sortOrder: 2,
  listId: 'list-1',
  createdAt: dayAgo,
  updatedAt: dayAgo,
};

const mockMovieItem: MovieItem = {
  id: '4',
  type: 'movie',
  title: 'The Shawshank Redemption',
  externalId: 'tmdb-278',
  metadata: {
    category: 'movie',
    description:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption.',
    rating: 9.3,
    releaseDate: '1994-09-23',
  },
  isChecked: false,
  sortOrder: 3,
  createdAt: dayAgo,
  updatedAt: dayAgo,
};

const mockBookItem: BookItem = {
  id: '5',
  type: 'book',
  title: 'Clean Code',
  externalId: 'isbn-9780132350884',
  metadata: {
    category: 'book',
    authors: ['Robert C. Martin'],
    description: 'A handbook of agile software craftsmanship.',
  },
  isChecked: true,
  sortOrder: 4,
  createdAt: dayAgo,
  updatedAt: dayAgo,
};

const mockGameItem: GameItem = {
  id: '6',
  type: 'game',
  title: 'The Legend of Zelda: Tears of the Kingdom',
  externalId: 'igdb-123456',
  metadata: {
    category: 'game',
    developer: 'Nintendo',
    rating: 9.5,
  },
  isChecked: false,
  sortOrder: 5,
  createdAt: now,
  updatedAt: now,
};

const meta: Meta<typeof ItemCard> = {
  title: 'Molecules/ItemCard',
  component: ItemCard,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, gap: 12 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ItemCard>;

export const NoteItemCard: Story = {
  args: {
    item: mockNoteItem,
    listName: 'Notes',
  },
};

export const ShoppingItemCard: Story = {
  args: {
    item: mockShoppingItem,
    listName: 'Weekly Groceries',
  },
};

export const ShoppingItemChecked: Story = {
  args: {
    item: mockShoppingItemChecked,
    listName: 'Weekly Groceries',
  },
};

export const MovieItemCard: Story = {
  args: {
    item: mockMovieItem,
    listName: 'Movies to Watch',
  },
};

export const BookItemCard: Story = {
  args: {
    item: mockBookItem,
    listName: 'Reading List',
  },
};

export const GameItemCard: Story = {
  args: {
    item: mockGameItem,
    listName: 'Games Backlog',
  },
};

export const WithoutListBadge: Story = {
  args: {
    item: mockNoteItem,
    showListBadge: false,
  },
};

export const Selected: Story = {
  args: {
    item: mockShoppingItem,
    listName: 'Weekly Groceries',
    selected: true,
  },
};

export const AllTypes: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <ItemCard item={mockNoteItem} listName="Notes" />
      <ItemCard item={mockShoppingItem} listName="Weekly Groceries" />
      <ItemCard item={mockShoppingItemChecked} listName="Weekly Groceries" />
      <ItemCard item={mockMovieItem} listName="Movies to Watch" />
      <ItemCard item={mockBookItem} listName="Reading List" />
      <ItemCard item={mockGameItem} listName="Games Backlog" />
    </View>
  ),
};
