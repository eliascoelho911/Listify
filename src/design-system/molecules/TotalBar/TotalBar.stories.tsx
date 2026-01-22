/**
 * TotalBar Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { TotalBar } from './TotalBar';

const meta: Meta<typeof TotalBar> = {
  title: 'Molecules/TotalBar',
  component: TotalBar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TotalBar>;

export const Default: Story = {
  args: {
    total: 85.47,
    checkedCount: 3,
    totalCount: 8,
  },
};

export const AllChecked: Story = {
  args: {
    total: 125.0,
    checkedCount: 5,
    totalCount: 5,
  },
};

export const NoneChecked: Story = {
  args: {
    total: 0,
    checkedCount: 0,
    totalCount: 10,
  },
};

export const WithItemsWithoutPrice: Story = {
  args: {
    total: 45.99,
    checkedCount: 2,
    totalCount: 6,
    itemsWithoutPrice: 3,
  },
};

export const LargeTotal: Story = {
  args: {
    total: 1234.56,
    checkedCount: 15,
    totalCount: 20,
    itemsWithoutPrice: 2,
  },
};
