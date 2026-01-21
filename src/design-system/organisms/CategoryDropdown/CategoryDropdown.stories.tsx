/**
 * CategoryDropdown Organism Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import type { List } from '@domain/list';

import { ThemeProvider } from '../../theme';
import { CategoryDropdown } from './CategoryDropdown';

const mockShoppingLists: List[] = [
  {
    id: '1',
    name: 'Mercado',
    description: 'Lista de compras semanal',
    listType: 'shopping',
    isPrefabricated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Feira',
    listType: 'shopping',
    isPrefabricated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockMovieLists: List[] = [
  {
    id: '3',
    name: 'Filmes para Assistir',
    listType: 'movies',
    isPrefabricated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockItemCounts: Record<string, number> = {
  '1': 12,
  '2': 5,
  '3': 8,
};

const meta: Meta<typeof CategoryDropdown> = {
  title: 'Organisms/CategoryDropdown',
  component: CategoryDropdown,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    expanded: { control: 'boolean' },
    onToggleExpand: { action: 'toggle expand' },
    onListPress: { action: 'list pressed' },
    onListLongPress: { action: 'list long pressed' },
  },
};

export default meta;

type Story = StoryObj<typeof CategoryDropdown>;

export const ShoppingExpanded: Story = {
  args: {
    category: 'shopping',
    lists: mockShoppingLists,
    itemCounts: mockItemCounts,
    expanded: true,
  },
};

export const ShoppingCollapsed: Story = {
  args: {
    category: 'shopping',
    lists: mockShoppingLists,
    itemCounts: mockItemCounts,
    expanded: false,
  },
};

export const MoviesExpanded: Story = {
  args: {
    category: 'movies',
    lists: mockMovieLists,
    itemCounts: mockItemCounts,
    expanded: true,
  },
};

export const BooksEmpty: Story = {
  args: {
    category: 'books',
    lists: [],
    itemCounts: {},
    expanded: true,
  },
};

export const GamesEmpty: Story = {
  args: {
    category: 'games',
    lists: [],
    itemCounts: {},
    expanded: true,
  },
};
