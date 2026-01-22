/**
 * HistoryList Organism Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { ThemeProvider } from '../../theme';
import { HistoryList } from './HistoryList';
import type { HistoryEntry } from './HistoryList.types';

const mockEntries: HistoryEntry[] = [
  {
    id: '1',
    purchaseDate: new Date('2026-01-22'),
    totalValue: 125.5,
    itemCount: 8,
  },
  {
    id: '2',
    purchaseDate: new Date('2026-01-20'),
    totalValue: 89.9,
    itemCount: 5,
  },
  {
    id: '3',
    purchaseDate: new Date('2026-01-15'),
    totalValue: 234.0,
    itemCount: 12,
  },
  {
    id: '4',
    purchaseDate: new Date('2026-01-10'),
    totalValue: 45.5,
    itemCount: 3,
  },
];

const meta: Meta<typeof HistoryList> = {
  title: 'Organisms/HistoryList',
  component: HistoryList,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ height: 500 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof HistoryList>;

export const Default: Story = {
  args: {
    entries: mockEntries,
    onEntryPress: (entry) => console.log('Entry pressed:', entry.id),
  },
};

export const Empty: Story = {
  args: {
    entries: [],
  },
};

export const Loading: Story = {
  args: {
    entries: [],
    isLoading: true,
  },
};

export const SingleEntry: Story = {
  args: {
    entries: [mockEntries[0]],
    onEntryPress: (entry) => console.log('Entry pressed:', entry.id),
  },
};

export const WithoutOnPress: Story = {
  args: {
    entries: mockEntries,
  },
};

export const CustomEmptyState: Story = {
  args: {
    entries: [],
    emptyTitle: 'Histórico vazio',
    emptyDescription: 'Complete sua primeira compra para ver o histórico aqui.',
  },
};
