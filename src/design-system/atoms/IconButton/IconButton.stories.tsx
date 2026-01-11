/**
 * IconButton Atom Stories
 *
 * Storybook documentation for all IconButton variants and sizes
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ArrowLeft, History, Menu, MoreVertical, Plus, Settings } from 'lucide-react-native';

import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  decorators: [
    (Story) => (
      <View style={{ padding: 20 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['ghost', 'outline', 'filled', 'accent'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    isActive: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Ghost: Story = {
  args: {
    icon: Menu,
    variant: 'ghost',
    size: 'md',
    accessibilityLabel: 'Menu',
    onPress: () => console.debug('Ghost pressed'),
  },
};

export const Outline: Story = {
  args: {
    icon: Settings,
    variant: 'outline',
    size: 'md',
    accessibilityLabel: 'Settings',
    onPress: () => console.debug('Outline pressed'),
  },
};

export const Filled: Story = {
  args: {
    icon: History,
    variant: 'filled',
    size: 'md',
    accessibilityLabel: 'History',
    onPress: () => console.debug('Filled pressed'),
  },
};

export const Accent: Story = {
  args: {
    icon: Plus,
    variant: 'accent',
    size: 'md',
    accessibilityLabel: 'Add',
    onPress: () => console.debug('Accent pressed'),
  },
};

export const Small: Story = {
  args: {
    icon: ArrowLeft,
    size: 'sm',
    accessibilityLabel: 'Back',
    onPress: () => console.debug('Small pressed'),
  },
};

export const Large: Story = {
  args: {
    icon: MoreVertical,
    size: 'lg',
    accessibilityLabel: 'More',
    onPress: () => console.debug('Large pressed'),
  },
};

export const Active: Story = {
  args: {
    icon: History,
    variant: 'ghost',
    isActive: true,
    accessibilityLabel: 'History (Active)',
    onPress: () => console.debug('Active pressed'),
  },
};

export const Disabled: Story = {
  args: {
    icon: Settings,
    variant: 'ghost',
    disabled: true,
    accessibilityLabel: 'Settings (Disabled)',
    onPress: () => console.debug('Disabled pressed'),
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <IconButton
        icon={Menu}
        variant="ghost"
        accessibilityLabel="Ghost variant"
        onPress={() => console.debug('Ghost pressed')}
      />
      <IconButton
        icon={Settings}
        variant="outline"
        accessibilityLabel="Outline variant"
        onPress={() => console.debug('Outline pressed')}
      />
      <IconButton
        icon={History}
        variant="filled"
        accessibilityLabel="Filled variant"
        onPress={() => console.debug('Filled pressed')}
      />
      <IconButton
        icon={Plus}
        variant="accent"
        accessibilityLabel="Accent variant"
        onPress={() => console.debug('Accent pressed')}
      />
    </View>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <IconButton
        icon={ArrowLeft}
        size="sm"
        accessibilityLabel="Small size"
        onPress={() => console.debug('Small pressed')}
      />
      <IconButton
        icon={Menu}
        size="md"
        accessibilityLabel="Medium size"
        onPress={() => console.debug('Medium pressed')}
      />
      <IconButton
        icon={MoreVertical}
        size="lg"
        accessibilityLabel="Large size"
        onPress={() => console.debug('Large pressed')}
      />
    </View>
  ),
};

export const NavbarExample: Story = {
  render: () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <IconButton
        icon={ArrowLeft}
        variant="ghost"
        accessibilityLabel="Back"
        onPress={() => console.debug('Back pressed')}
      />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <IconButton
          icon={History}
          variant="ghost"
          accessibilityLabel="History"
          onPress={() => console.debug('History pressed')}
        />
        <IconButton
          icon={MoreVertical}
          variant="ghost"
          accessibilityLabel="More options"
          onPress={() => console.debug('More pressed')}
        />
      </View>
    </View>
  ),
};
