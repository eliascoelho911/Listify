/**
 * SearchHistory Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { SearchHistory } from './SearchHistory';
import type { SearchHistoryItem } from './SearchHistory.types';

const meta: Meta<typeof SearchHistory> = {
  title: 'Molecules/SearchHistory',
  component: SearchHistory,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SearchHistory>;

const mockEntries: SearchHistoryItem[] = [
  { id: '1', query: 'React Native', searchedAt: new Date() },
  { id: '2', query: 'TypeScript generics', searchedAt: new Date(Date.now() - 60000) },
  { id: '3', query: 'Zustand store', searchedAt: new Date(Date.now() - 120000) },
];

export const Default: Story = {
  args: {
    entries: mockEntries,
    onSelectEntry: (query: string) => console.log('Selected:', query),
    onDeleteEntry: (id: string) => console.log('Delete:', id),
    onClearAll: () => console.log('Clear all'),
  },
};

export const Empty: Story = {
  args: {
    entries: [],
    onSelectEntry: (query: string) => console.log('Selected:', query),
  },
};

export const WithoutDelete: Story = {
  args: {
    entries: mockEntries,
    onSelectEntry: (query: string) => console.log('Selected:', query),
  },
};
