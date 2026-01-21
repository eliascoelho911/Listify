/**
 * SearchInput Molecule Stories
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Molecules/SearchInput',
  component: SearchInput,
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

type Story = StoryObj<typeof SearchInput>;

function SearchInputWithState(props: Partial<React.ComponentProps<typeof SearchInput>>) {
  const [value, setValue] = useState(props.value ?? '');
  return <SearchInput {...props} value={value} onChangeText={setValue} />;
}

export const Default: Story = {
  render: () => <SearchInputWithState placeholder="Search..." />,
};

export const WithValue: Story = {
  render: () => <SearchInputWithState value="React Native" placeholder="Search..." />,
};

export const AutoFocus: Story = {
  render: () => <SearchInputWithState placeholder="Type to search..." autoFocus />,
};
