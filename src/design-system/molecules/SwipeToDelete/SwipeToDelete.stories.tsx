/**
 * SwipeToDelete Molecule Stories
 *
 * Storybook stories for the SwipeToDelete component.
 */

import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { Meta, StoryObj } from '@storybook/react';

import { Text } from '../../atoms';
import { useTheme } from '../../theme';
import { SwipeToDelete } from './SwipeToDelete';

const SwipeToDeleteMeta: Meta<typeof SwipeToDelete> = {
  title: 'molecules/SwipeToDelete',
  component: SwipeToDelete,
  decorators: [
    (Story) => (
      <GestureHandlerRootView style={{ flex: 1, padding: 16 }}>
        <Story />
      </GestureHandlerRootView>
    ),
  ],
};

export default SwipeToDeleteMeta;

function SampleContent(): React.ReactElement {
  const { theme } = useTheme();
  return (
    <View
      style={{
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radii.md,
      }}
    >
      <Text
        style={{
          color: theme.colors.foreground,
          fontSize: theme.typography.sizes.base,
          fontFamily: theme.typography.families.body,
        }}
      >
        Swipe me left to delete
      </Text>
    </View>
  );
}

export const Default: StoryObj<typeof SwipeToDelete> = {
  render: () => (
    <SwipeToDelete onDelete={() => console.log('Deleted!')}>
      <SampleContent />
    </SwipeToDelete>
  ),
};

export const Disabled: StoryObj<typeof SwipeToDelete> = {
  render: () => (
    <SwipeToDelete onDelete={() => console.log('Deleted!')} enabled={false}>
      <SampleContent />
    </SwipeToDelete>
  ),
};

export const CustomLabel: StoryObj<typeof SwipeToDelete> = {
  render: () => (
    <SwipeToDelete onDelete={() => console.log('Removed!')} deleteLabel="Remove">
      <SampleContent />
    </SwipeToDelete>
  ),
};

function MultipleItemsContent(): React.ReactElement {
  const { theme } = useTheme();
  return (
    <View style={{ gap: theme.spacing.sm }}>
      {['Item 1', 'Item 2', 'Item 3'].map((item, index) => (
        <SwipeToDelete key={index} onDelete={() => console.log(`Deleted ${item}`)}>
          <View
            style={{
              padding: theme.spacing.lg,
              backgroundColor: theme.colors.card,
              borderRadius: theme.radii.md,
            }}
          >
            <Text
              style={{
                color: theme.colors.foreground,
                fontSize: theme.typography.sizes.base,
                fontFamily: theme.typography.families.body,
              }}
            >
              {item}
            </Text>
          </View>
        </SwipeToDelete>
      ))}
    </View>
  );
}

export const MultipleItems: StoryObj<typeof SwipeToDelete> = {
  render: () => <MultipleItemsContent />,
};
