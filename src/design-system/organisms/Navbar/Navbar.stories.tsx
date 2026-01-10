/**
 * Navbar Organism Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Bell, Menu, Search, Settings } from 'lucide-react-native';

import { ThemeProvider } from '../../theme';
import { Navbar } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Organisms/Navbar',
  component: Navbar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    title: 'Listify',
  },
};

export const WithMenuButton: Story = {
  args: {
    title: 'Shopping Lists',
    leftActions: [
      {
        icon: Menu,
        onPress: () => console.log('Menu pressed'),
        label: 'Menu',
      },
    ],
  },
};

export const WithActions: Story = {
  args: {
    title: 'My Lists',
    leftActions: [
      {
        icon: Menu,
        onPress: () => console.log('Menu'),
        label: 'Menu',
      },
    ],
    rightActions: [
      {
        icon: Search,
        onPress: () => console.log('Search'),
        label: 'Search',
      },
      {
        icon: Bell,
        onPress: () => console.log('Notifications'),
        label: 'Notifications',
      },
    ],
  },
};

export const WithMultipleActions: Story = {
  args: {
    title: 'Settings',
    rightActions: [
      {
        icon: Search,
        onPress: () => console.log('Search'),
        label: 'Search',
      },
      {
        icon: Bell,
        onPress: () => console.log('Notifications'),
        label: 'Notifications',
      },
      {
        icon: Settings,
        onPress: () => console.log('Settings'),
        label: 'Settings',
      },
    ],
  },
};

export const WithoutBorder: Story = {
  args: {
    title: 'Clean Look',
    showBorder: false,
    leftActions: [
      {
        icon: Menu,
        onPress: () => console.log('Menu'),
        label: 'Menu',
      },
    ],
  },
};
