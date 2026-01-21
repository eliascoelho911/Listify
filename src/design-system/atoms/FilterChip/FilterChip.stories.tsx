/**
 * FilterChip Atom Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { FileText, Film, Gamepad2, ShoppingCart } from 'lucide-react-native';

import { ThemeProvider } from '../../theme';
import { FilterChip } from './FilterChip';

const meta: Meta<typeof FilterChip> = {
  title: 'Atoms/FilterChip',
  component: FilterChip,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    onPress: { action: 'pressed' },
  },
};

export default meta;

type Story = StoryObj<typeof FilterChip>;

export const Default: Story = {
  args: {
    label: 'Notes',
  },
};

export const Selected: Story = {
  args: {
    label: 'Notes',
    selected: true,
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Notes',
    icon: FileText,
  },
};

export const WithIconSelected: Story = {
  args: {
    label: 'Notes',
    icon: FileText,
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Notes',
    disabled: true,
  },
};

export const AllTypes: Story = {
  render: () => (
    <>
      <FilterChip label="Notas" icon={FileText} selected />
      <FilterChip label="Compras" icon={ShoppingCart} />
      <FilterChip label="Filmes" icon={Film} />
      <FilterChip label="Jogos" icon={Gamepad2} />
    </>
  ),
};
