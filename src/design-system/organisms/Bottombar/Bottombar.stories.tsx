/**
 * Bottombar Atom Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { Bottombar } from './Bottombar';

const meta: Meta<typeof Bottombar> = {
  title: 'Organisms/Bottombar',
  component: Bottombar,
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

type Story = StoryObj<typeof Bottombar>;

export const Default: Story = {
  args: {
    children: 'Bottombar content',
  },
};
