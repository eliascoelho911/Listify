/**
 * InputOptionsMenu Stories
 *
 * Storybook stories for the input options context menu component.
 */

import React, { useState, type ReactElement } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { Button } from '@design-system/atoms';
import { ThemeProvider } from '@design-system/theme';

import { mockSingleInput } from './__mocks__/inboxMocks';
import { InputOptionsMenu } from './InputOptionsMenu';

const meta: Meta<typeof InputOptionsMenu> = {
  title: 'Inbox/InputOptionsMenu',
  component: InputOptionsMenu,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    visible: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputOptionsMenu>;

/**
 * Default state - menu visible with input
 */
export const Default: Story = {
  args: {
    input: mockSingleInput,
    visible: true,
    onClose: () => console.debug('Menu closed'),
    onEdit: (input) => console.debug('Edit:', input.id),
    onDelete: (input) => console.debug('Delete:', input.id),
  },
};

/**
 * Hidden state - menu not visible
 */
export const Hidden: Story = {
  args: {
    input: mockSingleInput,
    visible: false,
    onClose: () => console.debug('Menu closed'),
    onEdit: (input) => console.debug('Edit:', input.id),
    onDelete: (input) => console.debug('Delete:', input.id),
  },
};

/**
 * With null input - menu visible but actions disabled
 */
export const WithNullInput: Story = {
  args: {
    input: null,
    visible: true,
    onClose: () => console.debug('Menu closed'),
    onEdit: (input) => console.debug('Edit:', input.id),
    onDelete: (input) => console.debug('Delete:', input.id),
  },
};

/**
 * Interactive example with full flow
 */
function InteractiveExample(): ReactElement {
  const [visible, setVisible] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  const handleEdit = (): void => {
    setLastAction('Edit selected');
    setVisible(false);
  };

  const handleDelete = (): void => {
    setLastAction('Delete selected');
    setVisible(false);
  };

  return (
    <View style={{ alignItems: 'center', gap: 16 }}>
      <Button onPress={() => setVisible(true)}>Open Options Menu</Button>
      {lastAction && (
        <View style={{ padding: 8 }}>
          <Button variant="ghost" disabled>
            Last action: {lastAction}
          </Button>
        </View>
      )}
      <InputOptionsMenu
        input={mockSingleInput}
        visible={visible}
        onClose={() => setVisible(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </View>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};
