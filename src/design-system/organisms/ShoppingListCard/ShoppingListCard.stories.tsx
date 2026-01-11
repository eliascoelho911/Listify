/**
 * ShoppingListCard Organism Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ShoppingListCard } from './ShoppingListCard';

const meta: Meta<typeof ShoppingListCard> = {
  title: 'Organisms/ShoppingListCard',
  component: ShoppingListCard,
  decorators: [
    (Story) => (
      <View style={{ padding: 20, gap: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ShoppingListCard>;

export const Active: Story = {
  args: {
    title: 'Weekly Groceries',
    itemCount: 12,
    completedCount: 5,
    totalValue: 'R$ 234,50',
    lastUpdated: 'Updated 2 hours ago',
    status: 'active',
    onPress: () => console.log('Card pressed'),
  },
};

export const Completed: Story = {
  args: {
    title: 'Weekend Shopping',
    itemCount: 8,
    completedCount: 8,
    totalValue: 'R$ 156,00',
    lastUpdated: 'Completed yesterday',
    status: 'completed',
    onPress: () => console.log('Card pressed'),
  },
};

export const Archived: Story = {
  args: {
    title: 'Old Shopping List',
    itemCount: 15,
    completedCount: 12,
    totalValue: 'R$ 320,00',
    lastUpdated: 'Archived last week',
    status: 'archived',
    onPress: () => console.log('Card pressed'),
  },
};

export const EmptyList: Story = {
  args: {
    title: 'New List',
    itemCount: 0,
    completedCount: 0,
    lastUpdated: 'Created just now',
    status: 'active',
    onPress: () => console.log('Card pressed'),
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Monthly Shopping List for Household Items and Groceries',
    itemCount: 25,
    completedCount: 10,
    totalValue: 'R$ 890,75',
    lastUpdated: 'Updated 1 hour ago',
    status: 'active',
    onPress: () => console.log('Card pressed'),
  },
};

export const MultipleCards: Story = {
  render: () => (
    <>
      <ShoppingListCard
        title="Weekly Groceries"
        itemCount={12}
        completedCount={5}
        totalValue="R$ 234,50"
        lastUpdated="2 hours ago"
        status="active"
      />
      <ShoppingListCard
        title="Party Supplies"
        itemCount={8}
        completedCount={8}
        totalValue="R$ 156,00"
        lastUpdated="Yesterday"
        status="completed"
      />
      <ShoppingListCard
        title="Home Improvement"
        itemCount={6}
        completedCount={2}
        totalValue="R$ 1,245,00"
        lastUpdated="3 days ago"
        status="active"
      />
    </>
  ),
};
