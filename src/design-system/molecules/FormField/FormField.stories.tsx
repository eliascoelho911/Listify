/**
 * FormField Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, gap: 16 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'Email',
    inputProps: {
      placeholder: 'Enter your email',
    },
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    required: true,
    inputProps: {
      placeholder: 'Enter your email',
    },
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    helperText: 'Must be at least 8 characters',
    inputProps: {
      placeholder: 'Enter your password',
      secureTextEntry: true,
    },
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    required: true,
    errorMessage: 'Invalid email address',
    inputProps: {
      placeholder: 'Enter your email',
      value: 'invalid-email',
    },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Username',
    inputProps: {
      value: 'johndoe',
      editable: false,
    },
  },
};

export const MultipleFields: Story = {
  render: () => (
    <>
      <FormField label="First Name" required inputProps={{ placeholder: 'Enter first name' }} />
      <FormField label="Last Name" required inputProps={{ placeholder: 'Enter last name' }} />
      <FormField
        label="Email"
        required
        helperText="We'll never share your email"
        inputProps={{ placeholder: 'Enter email' }}
      />
    </>
  ),
};
