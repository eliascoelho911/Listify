/**
 * Bottombar Organism Stories
 *
 * Note: This component requires BottomTabBarProps which makes it difficult to
 * render in Storybook. These stories use a simplified mock for demonstration.
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { Text } from '../../atoms/Text/Text';

const meta: Meta = {
  title: 'Organisms/Bottombar',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Custom bottom navigation bar with FAB in center. This component is designed to work with Expo Router tabs and requires BottomTabBarProps. See the tabs layout implementation for usage.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Documentation: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Text variant="heading">Bottombar Component</Text>
      <Text variant="body" color="muted" style={{ marginTop: 8 }}>
        The Bottombar is a custom tab bar component designed for Expo Router. It displays 4
        navigation tabs (Inbox, Search, Notes, Lists) with a central FAB button for adding new
        items.
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: 16 }}>
        Usage in tabs layout:
      </Text>
      <Text variant="caption" color="muted" style={{ marginTop: 8 }}>
        {`<Tabs tabBar={(props) => <Bottombar {...props} onFABPress={handleFABPress} />}>`}
      </Text>
    </View>
  ),
};
