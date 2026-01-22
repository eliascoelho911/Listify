/**
 * SectionHeader Molecule Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { SectionHeader } from './SectionHeader';

const meta: Meta<typeof SectionHeader> = {
  title: 'Molecules/SectionHeader',
  component: SectionHeader,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {
  args: {
    name: 'Groceries',
    itemCount: 5,
    expanded: true,
  },
};

export const Collapsed: Story = {
  args: {
    name: 'Groceries',
    itemCount: 5,
    expanded: false,
  },
};

export const WithAddButton: Story = {
  args: {
    name: 'Groceries',
    itemCount: 5,
    expanded: true,
    showAddButton: true,
  },
};

export const NoItemCount: Story = {
  args: {
    name: 'Miscellaneous',
    expanded: true,
  },
};

export const LongName: Story = {
  args: {
    name: 'This is a very long section name that should truncate',
    itemCount: 12,
    expanded: true,
  },
};

export const Dragging: Story = {
  args: {
    name: 'Groceries',
    itemCount: 5,
    expanded: true,
    isDragging: true,
  },
};
