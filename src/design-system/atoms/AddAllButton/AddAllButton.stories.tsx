/**
 * AddAllButton Atom Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { AddAllButton } from './AddAllButton';

const meta: Meta<typeof AddAllButton> = {
  title: 'Atoms/AddAllButton',
  component: AddAllButton,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AddAllButton>;

export const Default: Story = {
  args: {
    label: 'Comprar tudo novamente',
    onPress: () => console.log('Add all pressed'),
  },
};

export const WithItemCount: Story = {
  args: {
    label: 'Comprar tudo novamente',
    itemCount: 12,
    onPress: () => console.log('Add all pressed'),
  },
};

export const Loading: Story = {
  args: {
    label: 'Comprar tudo novamente',
    itemCount: 12,
    loading: true,
    onPress: () => console.log('Add all pressed'),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Comprar tudo novamente',
    itemCount: 0,
    disabled: true,
    onPress: () => console.log('Add all pressed'),
  },
};
