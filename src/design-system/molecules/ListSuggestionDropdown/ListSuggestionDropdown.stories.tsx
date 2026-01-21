/**
 * ListSuggestionDropdown Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { ListSuggestionDropdown } from './ListSuggestionDropdown';
import type { ListSuggestion } from './ListSuggestionDropdown.types';

// Simple action logger for stories
const action =
  (name: string) =>
  (...args: unknown[]) => {
    console.log(`[Storybook Action] ${name}:`, ...args);
  };

const mockSuggestions: ListSuggestion[] = [
  { id: '1', name: 'Mercado', listType: 'shopping', sections: ['Laticínios', 'Padaria', 'Frios'] },
  { id: '2', name: 'Filmes para Ver', listType: 'movies' },
  { id: '3', name: 'Livros', listType: 'books', sections: ['Ficção', 'Técnicos'] },
  { id: '4', name: 'Notas', listType: 'notes' },
  { id: '5', name: 'Jogos', listType: 'games' },
];

const meta: Meta<typeof ListSuggestionDropdown> = {
  title: 'Molecules/ListSuggestionDropdown',
  component: ListSuggestionDropdown,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, minWidth: 300 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    visible: { control: 'boolean' },
    showCreateOption: { control: 'boolean' },
    searchText: { control: 'text' },
    maxSuggestions: { control: 'number' },
  },
};

export default meta;

type Story = StoryObj<typeof ListSuggestionDropdown>;

export const Default: Story = {
  args: {
    suggestions: mockSuggestions,
    visible: true,
    onSelectList: action('onSelectList'),
    onCreateNew: action('onCreateNew'),
  },
};

export const WithSearchText: Story = {
  args: {
    suggestions: mockSuggestions.filter((s) => s.name.toLowerCase().includes('merc')),
    visible: true,
    searchText: 'Merc',
    onSelectList: action('onSelectList'),
    onCreateNew: action('onCreateNew'),
  },
};

export const CreateNewOption: Story = {
  args: {
    suggestions: [],
    visible: true,
    searchText: 'Nova Lista',
    showCreateOption: true,
    onSelectList: action('onSelectList'),
    onCreateNew: action('onCreateNew'),
  },
};

export const EmptyNoCreate: Story = {
  args: {
    suggestions: [],
    visible: true,
    showCreateOption: false,
    onSelectList: action('onSelectList'),
  },
};

export const Hidden: Story = {
  args: {
    suggestions: mockSuggestions,
    visible: false,
    onSelectList: action('onSelectList'),
  },
};

export const LimitedSuggestions: Story = {
  args: {
    suggestions: mockSuggestions,
    visible: true,
    maxSuggestions: 3,
    onSelectList: action('onSelectList'),
    onCreateNew: action('onCreateNew'),
  },
};

export const ShoppingListsOnly: Story = {
  args: {
    suggestions: [
      { id: '1', name: 'Mercado', listType: 'shopping', sections: ['Laticínios', 'Padaria'] },
      { id: '2', name: 'Farmácia', listType: 'shopping' },
      { id: '3', name: 'Pet Shop', listType: 'shopping', sections: ['Ração', 'Brinquedos'] },
    ],
    visible: true,
    onSelectList: action('onSelectList'),
    onCreateNew: action('onCreateNew'),
    searchText: 'Compras',
  },
};

export const SingleSuggestion: Story = {
  args: {
    suggestions: [mockSuggestions[0]],
    visible: true,
    onSelectList: action('onSelectList'),
  },
};
