/**
 * CategorySelector Molecule Stories
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { CategorySelector } from './CategorySelector';
import type { SelectableListType } from './CategorySelector.types';

const meta: Meta<typeof CategorySelector> = {
  title: 'Molecules/CategorySelector',
  component: CategorySelector,
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

type Story = StoryObj<typeof CategorySelector>;

function CategorySelectorWithState(props: Partial<React.ComponentProps<typeof CategorySelector>>) {
  const [selectedType, setSelectedType] = useState<SelectableListType>(
    props.selectedType ?? 'shopping',
  );
  return <CategorySelector {...props} selectedType={selectedType} onSelect={setSelectedType} />;
}

export const Default: Story = {
  render: () => <CategorySelectorWithState />,
};

export const MoviesSelected: Story = {
  render: () => <CategorySelectorWithState selectedType="movies" />,
};

export const BooksSelected: Story = {
  render: () => <CategorySelectorWithState selectedType="books" />,
};

export const GamesSelected: Story = {
  render: () => <CategorySelectorWithState selectedType="games" />,
};
