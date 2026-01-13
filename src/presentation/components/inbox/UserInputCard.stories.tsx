/**
 * UserInputCard Stories
 *
 * Storybook stories for the user input card component.
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { ThemeProvider } from '@design-system/theme';

import {
  mockInputWithLongText,
  mockInputWithManyTags,
  mockInputWithoutTags,
  mockSingleInput,
  mockUserInputs,
} from './__mocks__/inboxMocks';
import { UserInputCard } from './UserInputCard';

const meta: Meta<typeof UserInputCard> = {
  title: 'Inbox/UserInputCard',
  component: UserInputCard,
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
type Story = StoryObj<typeof UserInputCard>;

/**
 * Default state - card with text and tags
 */
export const Default: Story = {
  args: {
    input: mockSingleInput,
    onPress: () => console.debug('Card pressed'),
    onLongPress: () => console.debug('Card long pressed'),
  },
};

/**
 * Card without tags
 */
export const WithoutTags: Story = {
  args: {
    input: mockInputWithoutTags,
    onPress: () => console.debug('Card pressed'),
    onLongPress: () => console.debug('Card long pressed'),
  },
};

/**
 * Card with many tags
 */
export const ManyTags: Story = {
  args: {
    input: mockInputWithManyTags,
    onPress: () => console.debug('Card pressed'),
    onLongPress: () => console.debug('Card long pressed'),
  },
};

/**
 * Card with long text content
 */
export const LongText: Story = {
  args: {
    input: mockInputWithLongText,
    onPress: () => console.debug('Card pressed'),
    onLongPress: () => console.debug('Card long pressed'),
  },
};

/**
 * Multiple cards showcase
 */
export const MultipleCards: Story = {
  render: () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {mockUserInputs.map((input) => (
        <UserInputCard
          key={input.id}
          input={input}
          onPress={() => console.debug('Pressed:', input.id)}
          onLongPress={() => console.debug('Long pressed:', input.id)}
        />
      ))}
    </ScrollView>
  ),
};
