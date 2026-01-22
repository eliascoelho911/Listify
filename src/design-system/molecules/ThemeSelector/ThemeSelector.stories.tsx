/**
 * ThemeSelector Molecule Stories
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { ThemeSelector } from './ThemeSelector';
import type { ThemeOption } from './ThemeSelector.types';

const meta: Meta<typeof ThemeSelector> = {
  title: 'Molecules/ThemeSelector',
  component: ThemeSelector,
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

type Story = StoryObj<typeof ThemeSelector>;

const ThemeSelectorWrapper = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('dark');

  return <ThemeSelector selectedTheme={selectedTheme} onSelect={setSelectedTheme} />;
};

export const Default: Story = {
  render: () => <ThemeSelectorWrapper />,
};

export const LightSelected: Story = {
  args: {
    selectedTheme: 'light',
    onSelect: () => {},
  },
};

export const DarkSelected: Story = {
  args: {
    selectedTheme: 'dark',
    onSelect: () => {},
  },
};

export const AutoSelected: Story = {
  args: {
    selectedTheme: 'auto',
    onSelect: () => {},
  },
};
