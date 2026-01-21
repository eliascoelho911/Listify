/**
 * SearchHistory Atom Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { SearchHistory } from './SearchHistory';

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

export const Default: Story = {
  args: {
    children: 'SearchHistory content',
  },
};
