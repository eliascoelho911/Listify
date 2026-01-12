/**
 * InputBar Molecule Stories
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Search } from 'lucide-react-native';

import { ThemeProvider } from '../../theme';
import { InputBar } from './InputBar';

const meta: Meta<typeof InputBar> = {
  title: 'Molecules/InputBar',
  component: InputBar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InputBar>;

function InputBarWithState(props: Partial<React.ComponentProps<typeof InputBar>>) {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <InputBar
      placeholder="Type something..."
      value={value}
      onChangeText={setValue}
      onSubmit={() => {
        setValue('');
      }}
      {...props}
    />
  );
}

export const Default: Story = {
  render: () => <InputBarWithState />,
};

export const WithValue: Story = {
  render: () => <InputBarWithState value="Hello world #tag" />,
};

export const Submitting: Story = {
  render: () => <InputBarWithState value="Sending..." isSubmitting />,
};

export const Disabled: Story = {
  render: () => <InputBarWithState value="Disabled input" disabled />,
};

export const CustomIcon: Story = {
  render: () => <InputBarWithState submitIcon={Plus} placeholder="Add item..." />,
};

export const SearchVariant: Story = {
  render: () => (
    <InputBarWithState submitIcon={Search} submitVariant="ghost" placeholder="Search..." />
  ),
};

export const Empty: Story = {
  render: () => <InputBarWithState value="" />,
};
