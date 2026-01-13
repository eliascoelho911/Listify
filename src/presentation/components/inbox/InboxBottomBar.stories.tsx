/**
 * InboxBottomBar Stories
 *
 * Storybook stories for the inbox bottom bar component.
 * Uses real components with mocked dependencies.
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { ThemeProvider } from '@design-system/theme';

import { InboxUIStoreProvider } from '../../state/inbox/InboxUIStoreProvider';
import { mockTags } from './__mocks__/inboxMocks';
import { MockAppDependenciesProvider } from './__mocks__/MockAppDependenciesProvider';
import { InboxBottomBar } from './InboxBottomBar';

/**
 * Decorator that provides all required contexts
 */
function StoryDecorator({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <MockAppDependenciesProvider>
      <ThemeProvider>
        <InboxUIStoreProvider>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>{children}</View>
        </InboxUIStoreProvider>
      </ThemeProvider>
    </MockAppDependenciesProvider>
  );
}

const meta: Meta<typeof InboxBottomBar> = {
  title: 'Inbox/InboxBottomBar',
  component: InboxBottomBar,
  decorators: [
    (Story) => (
      <StoryDecorator>
        <Story />
      </StoryDecorator>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InboxBottomBar>;

/**
 * Default state - empty input ready for user interaction
 */
export const Default: Story = {
  render: () => <InboxBottomBar />,
};

/**
 * With tag suggestions visible
 * Type "#" followed by text to see suggestions
 */
function WithTagSuggestionsExample(): React.ReactElement {
  return (
    <MockAppDependenciesProvider
      repositoryOptions={{
        initialTags: mockTags,
      }}
    >
      <ThemeProvider>
        <InboxUIStoreProvider>
          <View style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}>
            <InboxBottomBar />
          </View>
        </InboxUIStoreProvider>
      </ThemeProvider>
    </MockAppDependenciesProvider>
  );
}

export const WithTagSuggestions: Story = {
  render: () => <WithTagSuggestionsExample />,
  parameters: {
    docs: {
      description: {
        story: 'Type "#c" in the input to see tag suggestions for "compras", "casa", etc.',
      },
    },
  },
};

/**
 * Submitting state - shows loading while submitting
 */
export const Submitting: Story = {
  render: () => <InboxBottomBar />,
  parameters: {
    docs: {
      description: {
        story: 'Type text and click submit to see loading state.',
      },
    },
  },
};
