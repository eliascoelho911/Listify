/**
 * SearchResultCard Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { SearchResultCard } from './SearchResultCard';

const meta: Meta<typeof SearchResultCard> = {
  title: 'Molecules/SearchResultCard',
  component: SearchResultCard,
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

type Story = StoryObj<typeof SearchResultCard>;

export const NoteResult: Story = {
  args: {
    title: 'Meeting notes from yesterday',
    subtitle: 'Remember to follow up with the team...',
    resultType: 'note',
    timestamp: new Date(),
    onPress: () => console.log('Pressed note result'),
  },
};

export const ShoppingResult: Story = {
  args: {
    title: 'Buy milk and eggs',
    subtitle: 'Groceries',
    resultType: 'shopping',
    timestamp: new Date(Date.now() - 86400000),
    onPress: () => console.log('Pressed shopping result'),
  },
};

export const MovieResult: Story = {
  args: {
    title: 'The Shawshank Redemption',
    subtitle: 'Movies to Watch',
    resultType: 'movie',
    onPress: () => console.log('Pressed movie result'),
  },
};

export const WithHighlight: Story = {
  args: {
    title: 'Meeting notes from yesterday',
    subtitle: 'Remember to follow up...',
    resultType: 'note',
    searchQuery: 'meeting',
    onPress: () => console.log('Pressed'),
  },
};

export const ListResult: Story = {
  args: {
    title: 'Groceries',
    subtitle: '15 items',
    resultType: 'list',
    onPress: () => console.log('Pressed list result'),
  },
};
