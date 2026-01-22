/**
 * SelectableItemList Molecule Stories
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { SelectableItemList } from './SelectableItemList';
import type { SelectableItemListItem } from './SelectableItemList.types';

const mockItems: SelectableItemListItem[] = [
  {
    originalItemId: '1',
    title: 'Arroz 5kg',
    quantity: '2 un',
    price: 25.9,
    sortOrder: 0,
    wasChecked: true,
    existsInList: false,
  },
  {
    originalItemId: '2',
    title: 'Feijão 1kg',
    quantity: '3 un',
    price: 8.5,
    sortOrder: 1,
    wasChecked: true,
    existsInList: true,
  },
  {
    originalItemId: '3',
    title: 'Óleo de soja',
    quantity: '1 un',
    price: 7.99,
    sortOrder: 2,
    wasChecked: true,
    existsInList: false,
  },
  {
    originalItemId: '4',
    title: 'Açúcar 1kg',
    quantity: '2 un',
    price: 4.5,
    sortOrder: 3,
    wasChecked: true,
    existsInList: true,
  },
  {
    originalItemId: '5',
    title: 'Café 500g',
    price: 15.9,
    sortOrder: 4,
    wasChecked: true,
    existsInList: false,
  },
];

const meta: Meta<typeof SelectableItemList> = {
  title: 'Molecules/SelectableItemList',
  component: SelectableItemList,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, height: 400 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SelectableItemList>;

const SelectableItemListWithState = (props: {
  items: SelectableItemListItem[];
  initialSelected?: string[];
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(props.initialSelected ?? []));

  const handleSelectionChange = (itemId: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(props.items.map((item) => item.originalItemId)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  return (
    <SelectableItemList
      items={props.items}
      selectedIds={selectedIds}
      onSelectionChange={handleSelectionChange}
      onSelectAll={handleSelectAll}
      onDeselectAll={handleDeselectAll}
    />
  );
};

export const Default: Story = {
  render: () => <SelectableItemListWithState items={mockItems} />,
};

export const WithPreselected: Story = {
  render: () => <SelectableItemListWithState items={mockItems} initialSelected={['1', '3', '5']} />,
};

export const AllSelected: Story = {
  render: () => (
    <SelectableItemListWithState
      items={mockItems}
      initialSelected={mockItems.map((item) => item.originalItemId)}
    />
  ),
};

export const EmptyList: Story = {
  render: () => <SelectableItemListWithState items={[]} />,
};

export const Loading: Story = {
  args: {
    items: [],
    selectedIds: new Set(),
    onSelectionChange: () => {},
    isLoading: true,
  },
};
