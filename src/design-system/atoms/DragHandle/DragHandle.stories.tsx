/**
 * DragHandle Atom Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { DragHandle } from './DragHandle';

const meta: Meta<typeof DragHandle> = {
  title: 'Atoms/DragHandle',
  component: DragHandle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, gap: 16 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDragging: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DragHandle>;

export const Default: Story = {
  args: {
    size: 'md',
    isDragging: false,
    disabled: false,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Dragging: Story = {
  args: {
    size: 'md',
    isDragging: true,
  },
};

export const Disabled: Story = {
  args: {
    size: 'md',
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <DragHandle size="sm" />
      <DragHandle size="md" />
      <DragHandle size="lg" />
    </View>
  ),
};
