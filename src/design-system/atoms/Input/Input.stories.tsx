/**
 * Input Atom Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  decorators: [
    (Story) => (
      <View style={{ padding: 20 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Sample text',
    placeholder: 'Enter text...',
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Enter text...',
    state: 'error',
    errorMessage: 'This field is required',
  },
};

export const WithHelper: Story = {
  args: {
    placeholder: 'Enter text...',
    helperText: 'Enter your full name',
  },
};

export const Disabled: Story = {
  args: {
    value: 'Disabled input',
    editable: false,
  },
};

export const AllStates: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Input placeholder="Default state" />
      <Input placeholder="Error state" state="error" errorMessage="Invalid input" />
      <Input placeholder="With helper" helperText="This is helper text" />
      <Input value="Disabled" editable={false} />
    </View>
  ),
};
