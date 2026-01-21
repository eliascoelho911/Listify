/**
 * ListForm Organism Stories
 */

import React from 'react';
import { Alert, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { ListForm } from './ListForm';
import type { ListFormData } from './ListForm.types';

const meta: Meta<typeof ListForm> = {
  title: 'Organisms/ListForm',
  component: ListForm,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ListForm>;

const handleSubmit = (data: ListFormData): void => {
  Alert.alert('Form Submitted', `Name: ${data.name}\nType: ${data.listType}`);
};

const handleCancel = (): void => {
  Alert.alert('Cancelled', 'Form was cancelled');
};

export const Default: Story = {
  args: {
    onSubmit: handleSubmit,
    onCancel: handleCancel,
  },
};

export const WithInitialData: Story = {
  args: {
    initialData: {
      name: 'My Shopping List',
      listType: 'shopping',
    },
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    isEditing: true,
  },
};

export const WithError: Story = {
  args: {
    initialData: {
      name: 'Groceries',
      listType: 'shopping',
    },
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    error: 'A list with this name already exists in this category',
  },
};

export const Loading: Story = {
  args: {
    initialData: {
      name: 'New List',
      listType: 'movies',
    },
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    isLoading: true,
  },
};
