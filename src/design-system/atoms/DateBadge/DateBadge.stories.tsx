/**
 * DateBadge Atom Stories
 *
 * Badge de data para separadores em listas (sticky headers).
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { DateBadge } from './DateBadge';

const meta: Meta<typeof DateBadge> = {
  title: 'Atoms/DateBadge',
  component: DateBadge,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DateBadge>;

export const Today: Story = {
  args: {
    label: 'Hoje',
    variant: 'today',
  },
};

export const Yesterday: Story = {
  args: {
    label: 'Ontem',
    variant: 'yesterday',
  },
};

export const OtherDate: Story = {
  args: {
    label: '12 Jan 2025',
    variant: 'default',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <DateBadge label="Hoje" variant="today" />
      <DateBadge label="Ontem" variant="yesterday" />
      <DateBadge label="12 Jan 2025" variant="default" />
      <DateBadge label="Segunda-feira" />
    </View>
  ),
};
