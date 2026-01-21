/**
 * GroupHeader Atom Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { GroupHeader } from './GroupHeader';

const meta: Meta<typeof GroupHeader> = {
  title: 'Atoms/GroupHeader',
  component: GroupHeader,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, gap: 16 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof GroupHeader>;

export const DateVariant: Story = {
  args: {
    label: 'Today',
    variant: 'date',
  },
};

export const DateVariantWithCount: Story = {
  args: {
    label: 'Yesterday',
    variant: 'date',
    count: 5,
  },
};

export const ListVariant: Story = {
  args: {
    label: 'Shopping List',
    variant: 'list',
  },
};

export const ListVariantWithCount: Story = {
  args: {
    label: 'My Movies',
    variant: 'list',
    count: 12,
  },
};

export const CategoryVariant: Story = {
  args: {
    label: 'Compras',
    variant: 'category',
  },
};

export const CollapsibleExpanded: Story = {
  args: {
    label: 'Notes',
    variant: 'list',
    count: 8,
    collapsible: true,
    collapsed: false,
  },
};

export const CollapsibleCollapsed: Story = {
  args: {
    label: 'Notes',
    variant: 'list',
    count: 8,
    collapsible: true,
    collapsed: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <GroupHeader label="Today" variant="date" count={3} />
      <GroupHeader label="Shopping List" variant="list" count={7} />
      <GroupHeader label="Entertainment" variant="category" />
      <GroupHeader label="Collapsible" variant="list" collapsible collapsed={false} count={5} />
    </View>
  ),
};
