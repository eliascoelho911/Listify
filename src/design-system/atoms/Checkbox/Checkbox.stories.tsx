/**
 * Checkbox Atom Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { View } from 'react-native';

import { Text } from '../Text/Text';
import { ThemeProvider } from '../../theme';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
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

type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    checked: true,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    checked: true,
    size: 'lg',
  },
};

function InteractiveCheckboxExample(): React.ReactElement {
  const [checked, setChecked] = useState(false);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Checkbox checked={checked} onToggle={setChecked} />
      <Text>{checked ? 'Item marcado' : 'Item não marcado'}</Text>
    </View>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveCheckboxExample />,
};

function AllSizesExample(): React.ReactElement {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Checkbox checked size="sm" />
      <Checkbox checked size="md" />
      <Checkbox checked size="lg" />
    </View>
  );
}

export const AllSizes: Story = {
  render: () => <AllSizesExample />,
};
