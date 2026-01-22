/**
 * SectionAddButton Atom Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { SectionAddButton } from './SectionAddButton';

const meta: Meta<typeof SectionAddButton> = {
  title: 'Atoms/SectionAddButton',
  component: SectionAddButton,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SectionAddButton>;

export const Default: Story = {
  args: {},
};

export const CustomLabel: Story = {
  args: {
    label: 'New Section',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
