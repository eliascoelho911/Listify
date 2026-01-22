/**
 * ShoppingItemCard Molecule Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { View } from 'react-native';

import type { ShoppingItem } from '@domain/item/entities/item.entity';

import { ThemeProvider } from '../../theme';
import { ShoppingItemCard } from './ShoppingItemCard';

const mockItem: ShoppingItem = {
  id: '1',
  listId: 'list-1',
  title: 'Leite Integral',
  type: 'shopping',
  quantity: '2L',
  price: 8.5,
  isChecked: false,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockItemWithoutPrice: ShoppingItem = {
  ...mockItem,
  id: '2',
  title: 'Pão de Forma',
  price: undefined,
};

const mockItemChecked: ShoppingItem = {
  ...mockItem,
  id: '3',
  title: 'Ovos',
  quantity: '1dz',
  price: 12.99,
  isChecked: true,
};

const meta: Meta<typeof ShoppingItemCard> = {
  title: 'Molecules/ShoppingItemCard',
  component: ShoppingItemCard,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, gap: 12 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ShoppingItemCard>;

export const Default: Story = {
  args: {
    item: mockItem,
  },
};

export const WithoutPrice: Story = {
  args: {
    item: mockItemWithoutPrice,
  },
};

export const Checked: Story = {
  args: {
    item: mockItemChecked,
  },
};

export const Selected: Story = {
  args: {
    item: mockItem,
    selected: true,
  },
};

function InteractiveExample(): React.ReactElement {
  const [items, setItems] = useState<ShoppingItem[]>([
    { ...mockItem, id: '1', title: 'Leite Integral', quantity: '2L', price: 8.5, isChecked: false },
    { ...mockItem, id: '2', title: 'Pão de Forma', quantity: '1un', price: 6.99, isChecked: false },
    { ...mockItem, id: '3', title: 'Ovos', quantity: '1dz', price: 12.99, isChecked: true },
    {
      ...mockItem,
      id: '4',
      title: 'Queijo Mussarela',
      quantity: '200g',
      price: undefined,
      isChecked: false,
    },
  ]);

  const handleToggle = (item: ShoppingItem, checked: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isChecked: checked } : i)));
  };

  return (
    <View style={{ gap: 8 }}>
      {items.map((item) => (
        <ShoppingItemCard key={item.id} item={item} onToggle={handleToggle} />
      ))}
    </View>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};
