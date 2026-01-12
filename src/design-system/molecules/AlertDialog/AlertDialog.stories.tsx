/**
 * AlertDialog Molecule Stories
 *
 * Diálogo de confirmação. Baseado no AlertDialog do Shadcn.
 */

import React, { useState } from 'react';
import { Button, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { AlertDialog } from './AlertDialog';

const meta: Meta<typeof AlertDialog> = {
  title: 'Molecules/AlertDialog',
  component: AlertDialog,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AlertDialog>;

function DefaultExample() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button title="Open Dialog" onPress={() => setVisible(true)} />
      <AlertDialog
        visible={visible}
        title="Are you sure?"
        description="This action cannot be undone."
        onConfirm={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <DefaultExample />,
};

function DestructiveExample() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button title="Delete Item" onPress={() => setVisible(true)} />
      <AlertDialog
        visible={visible}
        title="Delete this item?"
        description="This will permanently delete the item. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}

export const Destructive: Story = {
  render: () => <DestructiveExample />,
};

function LoadingExample() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 2000);
  };

  return (
    <>
      <Button title="Open with Loading" onPress={() => setVisible(true)} />
      <AlertDialog
        visible={visible}
        title="Processing..."
        description="Please wait while we process your request."
        isLoading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}

export const Loading: Story = {
  render: () => <LoadingExample />,
};

function CustomLabelsExample() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button title="Custom Labels" onPress={() => setVisible(true)} />
      <AlertDialog
        visible={visible}
        title="Save changes?"
        description="You have unsaved changes. Would you like to save them?"
        confirmLabel="Save"
        cancelLabel="Discard"
        onConfirm={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}

export const CustomLabels: Story = {
  render: () => <CustomLabelsExample />,
};

function NoDescriptionExample() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button title="Simple Dialog" onPress={() => setVisible(true)} />
      <AlertDialog
        visible={visible}
        title="Confirm action?"
        onConfirm={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}

export const NoDescription: Story = {
  render: () => <NoDescriptionExample />,
};
