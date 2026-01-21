/**
 * Tabs Layout
 *
 * Main navigation tabs layout using Expo Router with custom Bottombar.
 */

import type { ReactElement } from 'react';
import { Tabs } from 'expo-router';

import { Bottombar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

export default function TabsLayout(): ReactElement {
  const { theme } = useTheme();

  const handleFABPress = (): void => {
    // TODO: Open SmartInputModal
    console.debug('[TabsLayout] FAB pressed - will open SmartInputModal');
  };

  return (
    <Tabs
      tabBar={(props) => <Bottombar {...props} onFABPress={handleFABPress} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inbox',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notas',
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: 'Listas',
        }}
      />
    </Tabs>
  );
}
