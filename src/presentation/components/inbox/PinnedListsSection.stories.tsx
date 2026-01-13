/**
 * PinnedListsSection Stories
 *
 * Storybook stories for the pinned lists section component.
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { ThemeProvider } from '@design-system/theme';

import { PinnedListsSection } from './PinnedListsSection';

const meta: Meta<typeof PinnedListsSection> = {
  title: 'Inbox/PinnedListsSection',
  component: PinnedListsSection,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1, padding: 16 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PinnedListsSection>;

/**
 * Empty state - no pinned lists (current default)
 */
export const Empty: Story = {
  render: () => <PinnedListsSection />,
};
