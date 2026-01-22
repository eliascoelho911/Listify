/**
 * HistoryCard Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { HistoryCard } from './HistoryCard';

const meta: Meta<typeof HistoryCard> = {
  title: 'Molecules/HistoryCard',
  component: HistoryCard,
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

type Story = StoryObj<typeof HistoryCard>;

export const Default: Story = {
  args: {
    purchaseDate: new Date('2026-01-22'),
    totalValue: 125.5,
    itemCount: 8,
    onPress: () => console.log('Card pressed'),
  },
};

export const SingleItem: Story = {
  args: {
    purchaseDate: new Date('2026-01-20'),
    totalValue: 15.99,
    itemCount: 1,
    onPress: () => console.log('Card pressed'),
  },
};

export const LargeTotal: Story = {
  args: {
    purchaseDate: new Date('2026-01-15'),
    totalValue: 1234.56,
    itemCount: 42,
    onPress: () => console.log('Card pressed'),
  },
};

export const WithoutOnPress: Story = {
  args: {
    purchaseDate: new Date('2026-01-10'),
    totalValue: 89.9,
    itemCount: 5,
  },
};

export const OldPurchase: Story = {
  args: {
    purchaseDate: new Date('2025-12-25'),
    totalValue: 450.0,
    itemCount: 15,
    onPress: () => console.log('Card pressed'),
  },
};
