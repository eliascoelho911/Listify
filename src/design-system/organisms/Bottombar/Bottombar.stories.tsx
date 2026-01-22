/**
 * Bottombar Organism Stories
 *
 * Note: This component requires BottomTabBarProps which makes it difficult to
 * render in Storybook. These stories use a simplified mock for demonstration.
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';

/**
 * Documentation component that can use hooks
 */
function DocumentationContent(): React.ReactElement {
  const { theme } = useTheme();
  return (
    <View style={{ padding: 16, backgroundColor: theme.colors.background }}>
      <Text variant="h2">Bottombar Component</Text>
      <Text variant="body" color="muted" style={{ marginTop: 8 }}>
        The Bottombar is a floating bottom navigation with a pill shape and centered FAB. Key
        features:
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: 16 }}>
        • Floating pill shape with 16px margins{'\n'}• 5 flex items: 4 tabs + 1 FAB{'\n'}• Equal
        spacing using flex layout{'\n'}• Primary cyan color for FAB
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: 16 }}>
        Usage in tabs layout:
      </Text>
      <Text variant="caption" color="muted" style={{ marginTop: 8 }}>
        {`<Tabs tabBar={(props) => <Bottombar {...props} onFABPress={handleFABPress} />}>`}
      </Text>
    </View>
  );
}

const meta: Meta = {
  title: 'Organisms/Bottombar',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Floating bottom navigation bar with pill shape and centered FAB. Designed for Expo Router tabs.',
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, minHeight: 400 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DocumentationContent />,
};

export const Documentation: Story = {
  render: () => <DocumentationContent />,
};
