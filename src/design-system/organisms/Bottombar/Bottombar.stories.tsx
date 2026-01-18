/**
 * Bottombar Organism Stories
 */

import type { ReactElement } from 'react';
import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Clock, Home, ShoppingBag, User } from 'lucide-react-native';

import { ThemeProvider } from '../../theme';
import { Bottombar } from './Bottombar';
import type { BottombarItem } from './Bottombar.types';

const meta: Meta<typeof Bottombar> = {
  title: 'Organisms/Bottombar',
  component: Bottombar,
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

type Story = StoryObj<typeof Bottombar>;

const mockItems: BottombarItem[] = [
  {
    id: 'home',
    icon: Home,
    label: 'Home',
    onPress: () => console.log('Home pressed'),
  },
  {
    id: 'shopping',
    icon: ShoppingBag,
    label: 'Shopping Lists',
    onPress: () => console.log('Shopping pressed'),
  },
  {
    id: 'history',
    icon: Clock,
    label: 'History',
    onPress: () => console.log('History pressed'),
  },
  {
    id: 'profile',
    icon: User,
    label: 'Profile',
    onPress: () => console.log('Profile pressed'),
  },
];

function InteractiveBottombar(): ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);

  const interactiveItems: BottombarItem[] = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      onPress: () => setActiveIndex(0),
    },
    {
      id: 'shopping',
      icon: ShoppingBag,
      label: 'Shopping Lists',
      onPress: () => setActiveIndex(1),
    },
    {
      id: 'history',
      icon: Clock,
      label: 'History',
      onPress: () => setActiveIndex(2),
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile',
      onPress: () => setActiveIndex(3),
    },
  ];

  return <Bottombar items={interactiveItems} activeIndex={activeIndex} />;
}

export const Interactive: Story = {
  render: () => <InteractiveBottombar />,
};

export const Default: Story = {
  args: {
    items: mockItems,
    activeIndex: 0,
  },
};

export const ShoppingActive: Story = {
  args: {
    items: mockItems,
    activeIndex: 1,
  },
};

export const HistoryActive: Story = {
  args: {
    items: mockItems,
    activeIndex: 2,
  },
};

export const ProfileActive: Story = {
  args: {
    items: mockItems,
    activeIndex: 3,
  },
};
