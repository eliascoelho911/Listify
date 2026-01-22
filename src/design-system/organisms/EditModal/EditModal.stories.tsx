/**
 * EditModal Organism Stories
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import type { ShoppingItem } from '@domain/item';

import { Button } from '../../atoms/Button/Button';
import { EditModal } from './EditModal';

const meta: Meta<typeof EditModal> = {
  title: 'Organisms/EditModal',
  component: EditModal,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EditModal>;

// Mock shopping item
const mockShoppingItem: ShoppingItem = {
  id: 'item-1',
  listId: 'list-1',
  sectionId: undefined,
  title: 'Leite',
  type: 'shopping',
  quantity: '2L',
  price: 8.99,
  isChecked: false,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockShoppingItemWithoutPrice: ShoppingItem = {
  id: 'item-2',
  listId: 'list-1',
  sectionId: undefined,
  title: 'Pão Francês',
  type: 'shopping',
  quantity: '10un',
  price: undefined,
  isChecked: false,
  sortOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Interactive example with a button to open the modal
 */
function InteractiveEditModal() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onPress={() => setVisible(true)}>Open Edit Modal</Button>
      <EditModal
        visible={visible}
        item={mockShoppingItem}
        onClose={() => setVisible(false)}
        onSubmit={(data) => {
          console.log('Submitted:', data);
          setVisible(false);
        }}
        onDelete={(item) => {
          console.log('Delete requested:', item);
          setVisible(false);
        }}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <InteractiveEditModal />,
};

/**
 * Modal open with shopping item (has price and quantity)
 */
export const WithShoppingItem: Story = {
  args: {
    visible: true,
    item: mockShoppingItem,
    onClose: () => console.log('Close'),
    onSubmit: (data) => console.log('Submit:', data),
    onDelete: (item) => console.log('Delete:', item),
  },
};

/**
 * Modal open with shopping item without price
 */
export const WithoutPrice: Story = {
  args: {
    visible: true,
    item: mockShoppingItemWithoutPrice,
    onClose: () => console.log('Close'),
    onSubmit: (data) => console.log('Submit:', data),
    onDelete: (item) => console.log('Delete:', item),
  },
};

/**
 * Modal without delete button
 */
export const WithoutDelete: Story = {
  args: {
    visible: true,
    item: mockShoppingItem,
    onClose: () => console.log('Close'),
    onSubmit: (data) => console.log('Submit:', data),
    // No onDelete prop
  },
};

/**
 * Modal in loading state
 */
export const Loading: Story = {
  args: {
    visible: true,
    item: mockShoppingItem,
    onClose: () => console.log('Close'),
    onSubmit: (data) => console.log('Submit:', data),
    onDelete: (item) => console.log('Delete:', item),
    isLoading: true,
  },
};
