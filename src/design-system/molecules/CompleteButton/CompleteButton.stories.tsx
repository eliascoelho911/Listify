/**
 * CompleteButton Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { CompleteButton } from './CompleteButton';

const meta: Meta<typeof CompleteButton> = {
  title: 'Molecules/CompleteButton',
  component: CompleteButton,
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

type Story = StoryObj<typeof CompleteButton>;

export const Default: Story = {
  args: {
    onPress: () => console.log('Complete purchase'),
    total: 125.5,
    checkedCount: 8,
  },
};

export const SingleItem: Story = {
  args: {
    onPress: () => console.log('Complete purchase'),
    total: 15.99,
    checkedCount: 1,
  },
};

export const LargeTotal: Story = {
  args: {
    onPress: () => console.log('Complete purchase'),
    total: 1234.56,
    checkedCount: 25,
  },
};

export const Loading: Story = {
  args: {
    onPress: () => console.log('Complete purchase'),
    total: 125.5,
    checkedCount: 8,
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    onPress: () => console.log('Complete purchase'),
    total: 125.5,
    checkedCount: 8,
    disabled: true,
  },
};

export const NoItems: Story = {
  args: {
    onPress: () => console.log('Complete purchase'),
    total: 0,
    checkedCount: 0,
  },
};

export const CustomLabel: Story = {
  args: {
    onPress: () => console.log('Complete purchase'),
    total: 125.5,
    checkedCount: 8,
    label: 'Finalizar pedido',
  },
};
