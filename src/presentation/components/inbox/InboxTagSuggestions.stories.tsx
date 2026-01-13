/**
 * InboxTagSuggestions Stories
 *
 * Storybook stories for the tag suggestions popup component.
 * Uses real components with mocked dependencies.
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { ThemeProvider } from '@design-system/theme';

import { InboxUIStoreProvider } from '../../state/inbox/InboxUIStoreProvider';
import { emptyTags, mockTags } from './__mocks__/inboxMocks';
import { MockAppDependenciesProvider } from './__mocks__/MockAppDependenciesProvider';
import { InboxTagSuggestions } from './InboxTagSuggestions';

/**
 * Decorator that provides all required contexts
 */
function StoryDecorator({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <MockAppDependenciesProvider>
      <ThemeProvider>
        <InboxUIStoreProvider>
          <View style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}>{children}</View>
        </InboxUIStoreProvider>
      </ThemeProvider>
    </MockAppDependenciesProvider>
  );
}

const meta: Meta<typeof InboxTagSuggestions> = {
  title: 'Inbox/InboxTagSuggestions',
  component: InboxTagSuggestions,
  decorators: [
    (Story) => (
      <StoryDecorator>
        <Story />
      </StoryDecorator>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InboxTagSuggestions>;

/**
 * Default state - no suggestions visible
 * The component only shows when there are suggestions or loading
 */
export const Default: Story = {
  render: () => <InboxTagSuggestions />,
};

/**
 * Empty state - no suggestions
 */
function EmptyExample(): React.ReactElement {
  return (
    <MockAppDependenciesProvider
      repositoryOptions={{
        initialTags: emptyTags,
      }}
    >
      <ThemeProvider>
        <InboxUIStoreProvider>
          <View style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}>
            <InboxTagSuggestions />
          </View>
        </InboxUIStoreProvider>
      </ThemeProvider>
    </MockAppDependenciesProvider>
  );
}

export const Empty: Story = {
  render: () => <EmptyExample />,
  parameters: {
    docs: {
      description: {
        story: 'When there are no matching tags, the component is hidden.',
      },
    },
  },
};

/**
 * With many tags available
 * Note: The component reads from VM state, so suggestions appear when typing "#"
 */
function WithTagsExample(): React.ReactElement {
  return (
    <MockAppDependenciesProvider
      repositoryOptions={{
        initialTags: mockTags,
      }}
    >
      <ThemeProvider>
        <InboxUIStoreProvider>
          <View style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}>
            <InboxTagSuggestions />
          </View>
        </InboxUIStoreProvider>
      </ThemeProvider>
    </MockAppDependenciesProvider>
  );
}

export const WithTags: Story = {
  render: () => <WithTagsExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Use InboxBottomBar story to see suggestions in action - this component reads VM state.',
      },
    },
  },
};
