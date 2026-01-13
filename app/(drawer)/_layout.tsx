/**
 * Drawer Layout
 *
 * Main navigation drawer layout using Expo Router Drawer.
 */

import type { ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

import { CustomDrawerContent } from '@presentation/components/navigation/CustomDrawerContent';
import { useTheme } from '@design-system/theme';

export default function DrawerLayout(): ReactElement {
  const { theme } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: theme.colors.background,
            width: 280,
          },
          drawerActiveTintColor: theme.colors.primary,
          drawerInactiveTintColor: theme.colors.mutedForeground,
          sceneStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Drawer.Screen
          name="inbox/index"
          options={{
            drawerLabel: 'Inbox',
            title: 'Inbox',
          }}
        />
        <Drawer.Screen
          name="settings/index"
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
          }}
        />
        {__DEV__ && (
          <Drawer.Screen
            name="debug/index"
            options={{
              drawerLabel: 'Debug',
              title: 'Debug',
            }}
          />
        )}
        {__DEV__ && (
          <Drawer.Screen
            name="storybook/index"
            options={{
              drawerLabel: 'Storybook',
              title: 'Storybook',
            }}
          />
        )}
      </Drawer>
    </GestureHandlerRootView>
  );
}
