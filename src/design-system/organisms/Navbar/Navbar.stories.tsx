/**
 * Navbar Organism Stories
 *
 * Demonstrates Neo-Minimal Dark navbar with animated accent line
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { ArrowLeft, History, MoreVertical, Plus, Settings } from 'lucide-react-native';

import { Navbar } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Organisms/Navbar',
  component: Navbar,
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    leftAction: {
      icon: ArrowLeft,
      onPress: () => console.debug('Back pressed'),
      label: 'Back',
    },
    rightActions: [
      {
        icon: History,
        onPress: () => console.debug('History pressed'),
        label: 'History',
      },
      {
        icon: MoreVertical,
        onPress: () => console.debug('More pressed'),
        label: 'More options',
      },
    ],
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Shopping List',
    leftAction: {
      icon: ArrowLeft,
      onPress: () => console.debug('Back pressed'),
      label: 'Back',
    },
    rightActions: [
      {
        icon: History,
        onPress: () => console.debug('History pressed'),
        label: 'History',
      },
      {
        icon: MoreVertical,
        onPress: () => console.debug('More pressed'),
        label: 'More options',
      },
    ],
  },
};

export const WithActiveAction: Story = {
  args: {
    leftAction: {
      icon: ArrowLeft,
      onPress: () => console.debug('Back pressed'),
      label: 'Back',
    },
    rightActions: [
      {
        icon: History,
        onPress: () => console.debug('History pressed'),
        label: 'History',
        isActive: true,
      },
      {
        icon: MoreVertical,
        onPress: () => console.debug('More pressed'),
        label: 'More options',
      },
    ],
  },
};

export const WithVariants: Story = {
  args: {
    leftAction: {
      icon: ArrowLeft,
      onPress: () => console.debug('Back pressed'),
      label: 'Back',
      variant: 'ghost',
    },
    rightActions: [
      {
        icon: Plus,
        onPress: () => console.debug('Add pressed'),
        label: 'Add',
        variant: 'accent',
      },
      {
        icon: Settings,
        onPress: () => console.debug('Settings pressed'),
        label: 'Settings',
        variant: 'outline',
      },
    ],
  },
};

export const WithoutAccentLine: Story = {
  args: {
    leftAction: {
      icon: ArrowLeft,
      onPress: () => console.debug('Back pressed'),
      label: 'Back',
    },
    rightActions: [
      {
        icon: MoreVertical,
        onPress: () => console.debug('More pressed'),
        label: 'More options',
      },
    ],
  },
};

export const WithoutAnimation: Story = {
  args: {
    animated: false,
    leftAction: {
      icon: ArrowLeft,
      onPress: () => console.debug('Back pressed'),
      label: 'Back',
    },
    rightActions: [
      {
        icon: History,
        onPress: () => console.debug('History pressed'),
        label: 'History',
      },
      {
        icon: MoreVertical,
        onPress: () => console.debug('More pressed'),
        label: 'More options',
      },
    ],
  },
};

export const OnlyLeftAction: Story = {
  args: {
    leftAction: {
      icon: ArrowLeft,
      onPress: () => console.debug('Back pressed'),
      label: 'Back',
    },
  },
};

export const OnlyRightActions: Story = {
  args: {
    rightActions: [
      {
        icon: History,
        onPress: () => console.debug('History pressed'),
        label: 'History',
      },
      {
        icon: MoreVertical,
        onPress: () => console.debug('More pressed'),
        label: 'More options',
      },
    ],
  },
};
