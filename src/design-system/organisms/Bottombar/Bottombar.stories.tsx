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

import { NavigationTab } from '../../atoms/NavigationTab/NavigationTab';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { BOTTOMBAR_CONFIG, createBottombarStyles } from './Bottombar.styles';
import { BottombarFAB } from './BottombarFAB';
import { BottombarNotch } from './BottombarNotch';

/**
 * Mock Bottombar for Storybook demonstration
 */
function MockBottombar(): React.ReactElement {
  const { theme } = useTheme();
  const styles = createBottombarStyles(theme);
  const [activeTab, setActiveTab] = useState('index');
  const [containerWidth, setContainerWidth] = useState(0);

  const tabs = [
    { key: 'index', icon: Inbox, label: 'Inbox' },
    { key: 'search', icon: Search, label: 'Buscar' },
    { key: 'notes', icon: StickyNote, label: 'Notas' },
    { key: 'lists', icon: List, label: 'Listas' },
  ];

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2, 4);

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
        <View
          style={styles.container}
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
          {/* SVG Background with notch */}
          <BottombarNotch
            width={containerWidth}
            height={BOTTOMBAR_CONFIG.height}
            fabSize={BOTTOMBAR_CONFIG.fabSize}
          />

          {/* Left tabs */}
          <View style={styles.leftTabs}>
            {leftTabs.map((tab) => (
              <NavigationTab
                key={tab.key}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.key}
                onPress={() => setActiveTab(tab.key)}
              />
            ))}
          </View>

          {/* Center spacer */}
          <View style={styles.centerSpacer} />

          {/* Right tabs */}
          <View style={styles.rightTabs}>
            {rightTabs.map((tab) => (
              <NavigationTab
                key={tab.key}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.key}
                onPress={() => setActiveTab(tab.key)}
              />
            ))}
          </View>

          {/* FAB */}
          <View style={styles.fabContainer}>
            <BottombarFAB
              icon={Plus}
              onPress={() => console.debug('FAB pressed')}
              accessibilityLabel="Add"
            />
          </View>
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
        The Bottombar is a floating bottom navigation with a pill shape and notch cutout for the
        FAB. Key features:
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: 16 }}>
        • Floating pill shape with 16px margins{'\n'}• Curved notch cutout for elevated FAB{'\n'}•
        64px FAB with cyan glow effect{'\n'}• 4 navigation tabs with active state
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
          'Floating bottom navigation bar with pill shape, notch cutout, and elevated FAB. Designed for Expo Router tabs.',
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
