/**
 * ListCard Molecule Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import type { List } from '@domain/list';

import { ListCard } from './ListCard';

const mockShoppingList: List = {
  id: '1',
  name: 'Mercado',
  description: 'Lista de compras semanal',
  listType: 'shopping',
  isPrefabricated: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockNotesList: List = {
  id: '2',
  name: 'Notas',
  description: 'Lista de notas pré-fabricada',
  listType: 'notes',
  isPrefabricated: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMoviesList: List = {
  id: '3',
  name: 'Filmes para Assistir',
  listType: 'movies',
  isPrefabricated: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockBooksList: List = {
  id: '4',
  name: 'Livros 2024',
  description: 'Meta de leitura',
  listType: 'books',
  isPrefabricated: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockGamesList: List = {
  id: '5',
  name: 'Backlog',
  listType: 'games',
  isPrefabricated: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const meta: Meta<typeof ListCard> = {
  title: 'Molecules/ListCard',
  component: ListCard,
  argTypes: {
    list: { control: 'object' },
    itemCount: { control: 'number' },
    selected: { control: 'boolean' },
    onPress: { action: 'pressed' },
    onLongPress: { action: 'long pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Shopping: Story = {
  args: {
    list: mockShoppingList,
    itemCount: 12,
    selected: false,
  },
};

export const Notes: Story = {
  args: {
    list: mockNotesList,
    itemCount: 5,
    selected: false,
  },
};

export const Movies: Story = {
  args: {
    list: mockMoviesList,
    itemCount: 8,
    selected: false,
  },
};

export const Books: Story = {
  args: {
    list: mockBooksList,
    itemCount: 3,
    selected: false,
  },
};

export const Games: Story = {
  args: {
    list: mockGamesList,
    itemCount: 15,
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    list: mockShoppingList,
    itemCount: 7,
    selected: true,
  },
};

export const Empty: Story = {
  args: {
    list: mockMoviesList,
    itemCount: 0,
    selected: false,
  },
};

export const NoDescription: Story = {
  args: {
    list: mockGamesList,
    itemCount: 4,
    selected: false,
  },
};
