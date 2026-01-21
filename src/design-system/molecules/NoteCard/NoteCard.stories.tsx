/**
 * NoteCard Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import type { NoteItem } from '@domain/item/entities/item.entity';

import { ThemeProvider } from '../../theme';
import { NoteCard } from './NoteCard';

const createNote = (overrides: Partial<NoteItem> = {}): NoteItem => ({
  id: 'note-1',
  type: 'note',
  title: 'Shopping List Ideas',
  description: 'Some **markdown** content with _formatting_ and a [link](https://example.com)',
  sortOrder: 0,
  createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  updatedAt: new Date(),
  ...overrides,
});

const meta: Meta<typeof NoteCard> = {
  title: 'Molecules/NoteCard',
  component: NoteCard,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, maxWidth: 400 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    onPress: { action: 'pressed' },
    onLongPress: { action: 'long pressed' },
  },
};

export default meta;

type Story = StoryObj<typeof NoteCard>;

export const Default: Story = {
  args: {
    note: createNote(),
  },
};

export const WithLongDescription: Story = {
  args: {
    note: createNote({
      title: 'Project Notes',
      description:
        'This is a much longer description that contains a lot of text to demonstrate how the card handles overflow. It should truncate nicely and show an ellipsis.',
    }),
  },
};

export const WithoutDescription: Story = {
  args: {
    note: createNote({
      title: 'Quick Note',
      description: undefined,
    }),
  },
};

export const Selected: Story = {
  args: {
    note: createNote(),
    selected: true,
  },
};

export const RecentlyCreated: Story = {
  args: {
    note: createNote({
      title: 'Just Created',
      createdAt: new Date(Date.now() - 1000 * 60 * 2), // 2 min ago
    }),
  },
};

export const CreatedDaysAgo: Story = {
  args: {
    note: createNote({
      title: 'Old Note',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    }),
  },
};

export const WithMarkdownContent: Story = {
  args: {
    note: createNote({
      title: 'Markdown Note',
      description: `# Header
## Subheader
- List item 1
- List item 2

Some **bold** and *italic* text.`,
    }),
  },
};
