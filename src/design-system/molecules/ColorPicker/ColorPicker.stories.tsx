/**
 * ColorPicker Molecule Stories
 *
 * Note: This file uses hardcoded color values intentionally as demo data.
 */
/* eslint-disable local-rules/no-hardcoded-values */

import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { ColorPicker } from './ColorPicker';
import type { ColorOption } from './ColorPicker.types';

const ACCENT_COLORS: ColorOption[] = [
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f97316', label: 'Orange' },
  { value: '#eab308', label: 'Yellow' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#a855f7', label: 'Violet' },
];

const meta: Meta<typeof ColorPicker> = {
  title: 'Molecules/ColorPicker',
  component: ColorPicker,
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

type Story = StoryObj<typeof ColorPicker>;

const ColorPickerWrapper = () => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>('#06b6d4');

  return (
    <ColorPicker colors={ACCENT_COLORS} selectedColor={selectedColor} onSelect={setSelectedColor} />
  );
};

export const Default: Story = {
  render: () => <ColorPickerWrapper />,
};

export const CyanSelected: Story = {
  args: {
    colors: ACCENT_COLORS,
    selectedColor: '#06b6d4',
    onSelect: () => {},
  },
};

export const PurpleSelected: Story = {
  args: {
    colors: ACCENT_COLORS,
    selectedColor: '#8b5cf6',
    onSelect: () => {},
  },
};

export const NoneSelected: Story = {
  args: {
    colors: ACCENT_COLORS,
    selectedColor: undefined,
    onSelect: () => {},
  },
};
