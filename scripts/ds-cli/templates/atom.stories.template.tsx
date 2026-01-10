/**
 * {{NAME}} Atom Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { ThemeProvider } from '../../theme';
import { {{NAME}} } from './{{NAME}}';

const meta: Meta<typeof {{NAME}}> = {
  title: 'Atoms/{{NAME}}',
  component: {{NAME}},
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

type Story = StoryObj<typeof {{NAME}}>;

export const Default: Story = {
  args: {
    children: '{{NAME}} content',
  },
};
