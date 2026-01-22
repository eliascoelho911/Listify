/**
 * Bottombar Organism Stories
 *
 * Note: This component requires BottomTabBarProps which makes it difficult to
 * render in Storybook. These stories use a simplified mock for demonstration.
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Inbox, List, Plus, Search, StickyNote } from 'lucide-react-native';

import { FAB } from '../../atoms/FAB/FAB';
import { NavigationTab } from '../../atoms/NavigationTab/NavigationTab';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { BOTTOMBAR_CONFIG, createBottombarStyles } from './Bottombar.styles';

/**
 * Mock Bottombar for Storybook demonstration
 */
function MockBottombar(): React.ReactElement {
  const { theme } = useTheme();
  const styles = createBottombarStyles(theme);
  const [activeTab, setActiveTab] = useState('index');

  const tabs = [
    { key: 'index', icon: Inbox, label: 'Inbox' },
    { key: 'search', icon: Search, label: 'Buscar' },
    { key: 'notes', icon: StickyNote, label: 'Notas' },
    { key: 'lists', icon: List, label: 'Listas' },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'flex-end',
      }}
    >
      {/* Content placeholder */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="caption" color="muted">
          Screen Content
        </Text>
      </View>

      {/* Floating Bottom Bar */}
      <View style={[styles.wrapper, { paddingBottom: BOTTOMBAR_CONFIG.bottomMargin + 20 }]}>
        <View style={styles.container}>
          {/* First 2 tabs */}
          {tabs.slice(0, 2).map((tab) => (
            <View key={tab.key} style={styles.item}>
              <NavigationTab
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.key}
                onPress={() => setActiveTab(tab.key)}
              />
            </View>
          ))}

          {/* Center FAB */}
          <View style={styles.item}>
            <FAB
              size="md"
              icon={Plus}
              onPress={() => console.debug('FAB pressed')}
              accessibilityLabel="Add"
            />
          </View>

          {/* Last 2 tabs */}
          {tabs.slice(2, 4).map((tab) => (
            <View key={tab.key} style={styles.item}>
              <NavigationTab
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.key}
                onPress={() => setActiveTab(tab.key)}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

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
  component: MockBottombar,
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
  render: () => <MockBottombar />,
};

export const Documentation: Story = {
  render: () => <DocumentationContent />,
};
