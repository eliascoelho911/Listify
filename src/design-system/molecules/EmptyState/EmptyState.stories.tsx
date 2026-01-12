/**
 * EmptyState Molecule Stories
 *
 * Stories for the empty state component.
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { FileText, Inbox, Search } from 'lucide-react-native';

import { ThemeProvider } from '../../theme';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1, padding: 20 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    subtitle: {
      control: { type: 'text' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'No items yet',
    subtitle: 'Add your first item to get started.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: Inbox,
    title: 'Your inbox is empty',
    subtitle: 'Quick capture your thoughts using the input below.',
  },
};

export const SearchEmpty: Story = {
  args: {
    icon: Search,
    title: 'No results found',
    subtitle: 'Try a different search term.',
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Nothing here',
  },
};

export const WithDocumentIcon: Story = {
  args: {
    icon: FileText,
    title: 'No documents',
    subtitle: 'Upload or create your first document.',
  },
};
