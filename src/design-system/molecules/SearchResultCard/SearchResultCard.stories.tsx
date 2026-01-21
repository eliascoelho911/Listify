/**
 * SearchResultCard Atom Stories
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
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SearchResultCard>;

export const Default: Story = {
  args: {
    children: 'SearchResultCard content',
  },
};
