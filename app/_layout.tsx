import type { ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DrizzleProvider } from '@drizzle/DrizzleProvider';

import { AppDependenciesProvider } from '@app/di/AppDependenciesProvider';
import { initializeI18n } from '@app/i18n/i18n';
import { ThemeProvider } from '@design-system/theme';

const StorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export const unstable_settings = {
  initialRouteName: StorybookEnabled ? '(storybook)/index' : '(drawer)',
};

initializeI18n().catch(() => undefined);

function NavigationStack(): ReactElement {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Protected guard={StorybookEnabled}>
        <Stack.Screen name="(storybook)/index" options={{ title: 'Storybook' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout(): ReactElement {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppDependenciesProvider>
            <DrizzleProvider>
              <StatusBar style="light" />
              <NavigationStack />
            </DrizzleProvider>
          </AppDependenciesProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
