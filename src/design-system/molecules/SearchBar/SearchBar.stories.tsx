/**
 * SearchBar Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
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

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    placeholder: 'Search...',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Search products',
    value: 'milk',
  },
};

export const WithoutClearButton: Story = {
  args: {
    placeholder: 'Search...',
    showClear: false,
    value: 'test search',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search...',
    value: 'disabled search',
    editable: false,
  },
};
