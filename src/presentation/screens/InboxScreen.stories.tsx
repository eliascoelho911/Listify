/**
 * InboxScreen Stories
 *
 * Storybook stories for the main inbox screen.
 * Uses real components with mocked dependencies for full integration testing.
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { NavigationContainer } from '@react-navigation/native';

import { ThemeProvider } from '@design-system/theme';

import {
  MockAppDependenciesProvider,
  type MockAppDependenciesProviderProps,
} from '../components/inbox/__mocks__/MockAppDependenciesProvider';
import {
  emptyUserInputs,
  mockTags,
  mockUserInputs,
} from '../components/inbox/__mocks__/inboxMocks';
import { InboxScreen } from './InboxScreen';

/**
 * Navigation mock wrapper
 */
function NavigationWrapper({ children }: { children: React.ReactNode }): React.ReactElement {
  return <NavigationContainer>{children}</NavigationContainer>;
}

/**
 * Full decorator with all required contexts
 */
function StoryDecorator({
  children,
  repositoryOptions,
}: {
  children: React.ReactNode;
  repositoryOptions?: MockAppDependenciesProviderProps['repositoryOptions'];
}): React.ReactElement {
  return (
    <MockAppDependenciesProvider repositoryOptions={repositoryOptions}>
      <ThemeProvider>
        <NavigationWrapper>
          <View style={{ flex: 1 }}>{children}</View>
        </NavigationWrapper>
      </ThemeProvider>
    </MockAppDependenciesProvider>
  );
}

const meta: Meta<typeof InboxScreen> = {
  title: 'Inbox/InboxScreen',
  component: InboxScreen,
  decorators: [
    (Story) => (
      <StoryDecorator>
        <Story />
      </StoryDecorator>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InboxScreen>;

/**
 * Default state - screen with list of inputs
 */
export const Default: Story = {
  render: () => <InboxScreen />,
};

/**
 * Empty state - no inputs yet
 */
function EmptyExample(): React.ReactElement {
  return (
    <StoryDecorator
      repositoryOptions={{
        initialInputs: emptyUserInputs,
        initialTags: mockTags,
      }}
    >
      <InboxScreen />
    </StoryDecorator>
  );
}

export const Empty: Story = {
  render: () => <EmptyExample />,
};

/**
 * With many inputs - shows scrolling behavior
 */
function WithManyInputsExample(): React.ReactElement {
  // Create more inputs for scrolling demo
  const manyInputs = [
    ...mockUserInputs,
    ...mockUserInputs.map((input, i) => ({
      ...input,
      id: `input-extra-${i}`,
      text: `Extra item ${i + 1}: ${input.text}`,
      createdAt: new Date(Date.now() - (i + 10) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - (i + 10) * 24 * 60 * 60 * 1000),
    })),
  ];

  return (
    <StoryDecorator
      repositoryOptions={{
        initialInputs: manyInputs,
        initialTags: mockTags,
      }}
    >
      <InboxScreen />
    </StoryDecorator>
  );
}

export const WithManyInputs: Story = {
  render: () => <WithManyInputsExample />,
};

/**
 * Loading state simulation
 * Note: Initial load is very fast with mock data, so this shows
 * the loading state for "load more" scenario
 */
function LoadingExample(): React.ReactElement {
  return (
    <StoryDecorator
      repositoryOptions={{
        initialInputs: mockUserInputs,
        initialTags: mockTags,
        loadingDelay: 2000,
      }}
    >
      <InboxScreen />
    </StoryDecorator>
  );
}

export const Loading: Story = {
  render: () => <LoadingExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Shows loading behavior with delayed responses. Try scrolling or submitting to see loading states.',
      },
    },
  },
};

/**
 * Error state simulation
 */
function WithErrorExample(): React.ReactElement {
  return (
    <StoryDecorator
      repositoryOptions={{
        initialInputs: mockUserInputs,
        initialTags: mockTags,
        simulateError: true,
      }}
    >
      <InboxScreen />
    </StoryDecorator>
  );
}

export const WithError: Story = {
  render: () => <WithErrorExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Repository configured to throw errors. Try submitting or loading more to see error handling.',
      },
    },
  },
};
