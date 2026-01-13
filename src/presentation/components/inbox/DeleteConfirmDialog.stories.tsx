/**
 * DeleteConfirmDialog Stories
 *
 * Storybook stories for the delete confirmation dialog component.
 */

import React, { type ReactElement, useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { Button } from '@design-system/atoms';
import { ThemeProvider } from '@design-system/theme';

import { DeleteConfirmDialog } from './DeleteConfirmDialog';

const meta: Meta<typeof DeleteConfirmDialog> = {
  title: 'Inbox/DeleteConfirmDialog',
  component: DeleteConfirmDialog,
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
    isDeleting: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DeleteConfirmDialog>;

/**
 * Interactive example with full flow
 */
function InteractiveExample(): ReactElement {
  const [visible, setVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (): Promise<void> => {
    setIsDeleting(true);
    // Simulate delete operation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsDeleting(false);
    setVisible(false);
    console.debug('Item deleted');
  };

  const handleCancel = (): void => {
    setVisible(false);
    console.debug('Delete cancelled');
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Button onPress={() => setVisible(true)}>Open Delete Dialog</Button>
      <DeleteConfirmDialog
        visible={visible}
        isDeleting={isDeleting}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};
