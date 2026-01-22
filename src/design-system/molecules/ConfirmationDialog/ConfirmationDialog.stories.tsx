/**
 * ConfirmationDialog Molecule Stories
 *
 * Dialog de confirmação para ações destrutivas. Inspirado no AlertDialog do Shadcn.
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../atoms';
import { ConfirmationDialog } from './ConfirmationDialog';

const meta: Meta<typeof ConfirmationDialog> = {
  title: 'Molecules/ConfirmationDialog',
  component: ConfirmationDialog,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ConfirmationDialog>;

const ConfirmationDialogWrapper = ({
  title,
  description,
  confirmButton,
  cancelButton,
  isLoading,
}: {
  title: string;
  description?: string;
  confirmButton: { label: string; destructive?: boolean };
  cancelButton?: { label: string };
  isLoading?: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onPress={() => setVisible(true)}>Open Dialog</Button>
      <ConfirmationDialog
        visible={visible}
        title={title}
        description={description}
        confirmButton={confirmButton}
        cancelButton={cancelButton}
        onConfirm={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        isLoading={isLoading}
      />
    </>
  );
};

export const Default: Story = {
  render: () => (
    <ConfirmationDialogWrapper
      title="Delete Item"
      description="Are you sure you want to delete this item? This action cannot be undone."
      confirmButton={{ label: 'Delete', destructive: true }}
      cancelButton={{ label: 'Cancel' }}
    />
  ),
};

export const NonDestructive: Story = {
  render: () => (
    <ConfirmationDialogWrapper
      title="Save Changes"
      description="Do you want to save your changes before leaving?"
      confirmButton={{ label: 'Save' }}
      cancelButton={{ label: 'Discard' }}
    />
  ),
};

export const NoDescription: Story = {
  render: () => (
    <ConfirmationDialogWrapper
      title="Confirm Action"
      confirmButton={{ label: 'Confirm' }}
      cancelButton={{ label: 'Cancel' }}
    />
  ),
};

export const SingleButton: Story = {
  render: () => (
    <ConfirmationDialogWrapper
      title="Information"
      description="This operation was completed successfully."
      confirmButton={{ label: 'OK' }}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <ConfirmationDialogWrapper
      title="Delete List"
      description="Are you sure you want to delete this list and all its items?"
      confirmButton={{ label: 'Delete', destructive: true }}
      cancelButton={{ label: 'Cancel' }}
      isLoading
    />
  ),
};
