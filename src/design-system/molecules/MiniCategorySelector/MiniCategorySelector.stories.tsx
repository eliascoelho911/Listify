/**
 * MiniCategorySelector Molecule Stories
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { Text } from '../../atoms/Text/Text';
import { ThemeProvider } from '../../theme';
import { MiniCategorySelector } from './MiniCategorySelector';
import type { SelectableListType } from './MiniCategorySelector.types';

const meta: Meta<typeof MiniCategorySelector> = {
  title: 'Molecules/MiniCategorySelector',
  component: MiniCategorySelector,
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

type Story = StoryObj<typeof MiniCategorySelector>;

export const Default: Story = {
  args: {
    onSelect: (type: SelectableListType) => console.log('Selected:', type),
  },
};

export const WithSelection: Story = {
  args: {
    selectedType: 'shopping',
    onSelect: (type: SelectableListType) => console.log('Selected:', type),
  },
};

export const WithInference: Story = {
  args: {
    inferredType: 'movies',
    onSelect: (type: SelectableListType) => console.log('Selected:', type),
  },
};

export const WithInferenceAndSelection: Story = {
  args: {
    selectedType: 'books',
    inferredType: 'movies',
    onSelect: (type: SelectableListType) => console.log('Selected:', type),
  },
};

export const IconsOnly: Story = {
  args: {
    showLabels: false,
    selectedType: 'games',
    onSelect: (type: SelectableListType) => console.log('Selected:', type),
  },
};

function InteractiveExample() {
  const [selected, setSelected] = useState<SelectableListType | undefined>(undefined);

  return (
    <View style={{ gap: 16 }}>
      <Text>Selected: {selected ?? 'None'}</Text>
      <MiniCategorySelector
        selectedType={selected}
        onSelect={setSelected}
        inferredType="shopping"
      />
    </View>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};
