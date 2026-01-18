/**
 * Fab Atom Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Edit, Heart, Plus, Trash2 } from 'lucide-react-native';

import { ThemeProvider } from '../../theme';
import { Text } from '../Text/Text';
import { Fab } from './Fab';

const meta: Meta<typeof Fab> = {
  title: 'Atoms/Fab',
  component: Fab,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Fab>;

export const Default: Story = {
  args: {
    icon: Plus,
    size: 'medium',
    onPress: () => console.log('FAB pressed'),
    accessibilityLabel: 'Add new item',
    disabled: false,
  },
};

export const Small: Story = {
  args: {
    icon: Plus,
    size: 'small',
    onPress: () => console.log('Small FAB pressed'),
    accessibilityLabel: 'Add new item',
  },
};

export const Medium: Story = {
  args: {
    icon: Plus,
    size: 'medium',
    onPress: () => console.log('Medium FAB pressed'),
    accessibilityLabel: 'Add new item',
  },
};

export const Disabled: Story = {
  args: {
    icon: Plus,
    size: 'medium',
    onPress: () => console.log('This should not be called'),
    accessibilityLabel: 'Add new item',
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <View style={{ gap: 8, alignItems: 'center' }}>
        <Text variant="body" style={{ marginBottom: 8 }}>
          Small
        </Text>
        <Fab
          icon={Plus}
          size="small"
          onPress={() => console.log('Small FAB')}
          accessibilityLabel="Add small"
        />
      </View>
      <View style={{ gap: 8, alignItems: 'center' }}>
        <Text variant="body" style={{ marginBottom: 8 }}>
          Medium
        </Text>
        <Fab
          icon={Plus}
          size="medium"
          onPress={() => console.log('Medium FAB')}
          accessibilityLabel="Add medium"
        />
      </View>
    </View>
  ),
};

export const DifferentIcons: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
      <View style={{ gap: 8, alignItems: 'center' }}>
        <Text variant="body">Plus</Text>
        <Fab
          icon={Plus}
          size="medium"
          onPress={() => console.log('Plus')}
          accessibilityLabel="Add"
        />
      </View>
      <View style={{ gap: 8, alignItems: 'center' }}>
        <Text variant="body">Edit</Text>
        <Fab
          icon={Edit}
          size="medium"
          onPress={() => console.log('Edit')}
          accessibilityLabel="Edit"
        />
      </View>
      <View style={{ gap: 8, alignItems: 'center' }}>
        <Text variant="body">Delete</Text>
        <Fab
          icon={Trash2}
          size="medium"
          onPress={() => console.log('Delete')}
          accessibilityLabel="Delete"
        />
      </View>
      <View style={{ gap: 8, alignItems: 'center' }}>
        <Text variant="body">Favorite</Text>
        <Fab
          icon={Heart}
          size="medium"
          onPress={() => console.log('Favorite')}
          accessibilityLabel="Favorite"
        />
      </View>
    </View>
  ),
};
