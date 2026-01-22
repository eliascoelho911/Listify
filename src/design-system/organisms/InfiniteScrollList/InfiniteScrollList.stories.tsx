/**
 * InfiniteScrollList Organism Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Inbox } from 'lucide-react-native';

import type { NoteItem, ShoppingItem } from '@domain/item/entities/item.entity';

import { Text } from '../../atoms/Text/Text';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { ItemCard } from '../../molecules/ItemCard/ItemCard';
import { ThemeProvider, useTheme } from '../../theme';
import { InfiniteScrollList } from './InfiniteScrollList';
import type { InfiniteScrollGroup } from './InfiniteScrollList.types';

interface SimpleItem {
  id: string;
  title: string;
}

const now = new Date();
const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

const mockNoteItems: NoteItem[] = [
  {
    id: '1',
    type: 'note',
    title: 'Meeting notes',
    description: 'Discussion about Q1 goals',
    sortOrder: 0,
    createdAt: hourAgo,
    updatedAt: hourAgo,
  },
  {
    id: '2',
    type: 'note',
    title: 'Shopping list ideas',
    sortOrder: 1,
    createdAt: hourAgo,
    updatedAt: hourAgo,
  },
];

const mockShoppingItems: ShoppingItem[] = [
  {
    id: '3',
    type: 'shopping',
    title: 'Milk',
    quantity: '2L',
    price: 8.99,
    sortOrder: 0,
    createdAt: dayAgo,
    updatedAt: dayAgo,
  },
  {
    id: '4',
    type: 'shopping',
    title: 'Bread',
    quantity: '1 unit',
    price: 5.5,
    isChecked: true,
    sortOrder: 1,
    createdAt: dayAgo,
    updatedAt: dayAgo,
  },
];

const simpleGroups: InfiniteScrollGroup<SimpleItem>[] = [
  {
    key: 'today',
    title: 'Today',
    items: [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
      { id: '3', title: 'Item 3' },
    ],
  },
  {
    key: 'yesterday',
    title: 'Yesterday',
    items: [
      { id: '4', title: 'Item 4' },
      { id: '5', title: 'Item 5' },
    ],
  },
];

const itemCardGroups: InfiniteScrollGroup<NoteItem | ShoppingItem>[] = [
  {
    key: 'today',
    title: 'Today',
    items: mockNoteItems,
  },
  {
    key: 'yesterday',
    title: 'Yesterday',
    items: mockShoppingItems,
  },
];

function SimpleItemCard({ item }: { item: SimpleItem }): React.ReactElement {
  const { theme } = useTheme();
  return (
    <View
      style={{
        padding: theme.spacing.md,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radii.sm,
      }}
    >
      <Text style={{ color: theme.colors.foreground }}>{item.title}</Text>
    </View>
  );
}

const meta: Meta<typeof InfiniteScrollList> = {
  title: 'Organisms/InfiniteScrollList',
  component: InfiniteScrollList,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ height: 400 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof InfiniteScrollList<SimpleItem>>;

export const Default: Story = {
  render: () => (
    <InfiniteScrollList
      groups={simpleGroups}
      renderItem={(item: SimpleItem) => <SimpleItemCard item={item} />}
      keyExtractor={(item: SimpleItem) => item.id}
    />
  ),
};

export const WithItemCards: Story = {
  render: () => (
    <InfiniteScrollList
      groups={itemCardGroups}
      renderItem={(item) => <ItemCard item={item} listName="My List" />}
      keyExtractor={(item) => item.id}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <InfiniteScrollList
      groups={simpleGroups}
      renderItem={(item: SimpleItem) => <SimpleItemCard item={item} />}
      keyExtractor={(item: SimpleItem) => item.id}
      isLoading
      hasMore
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <InfiniteScrollList
      groups={[]}
      renderItem={(item: SimpleItem) => <SimpleItemCard item={item} />}
      keyExtractor={(item: SimpleItem) => item.id}
      emptyContent={
        <EmptyState icon={Inbox} title="No items yet" subtitle="Add your first item to get started" />
      }
    />
  ),
};

export const WithRefresh: Story = {
  render: () => (
    <InfiniteScrollList
      groups={simpleGroups}
      renderItem={(item: SimpleItem) => <SimpleItemCard item={item} />}
      keyExtractor={(item: SimpleItem) => item.id}
      onRefresh={() => console.debug('Refreshing...')}
      refreshing={false}
    />
  ),
};
