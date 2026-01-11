import type { ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { initializeI18n } from '@app/i18n/i18n';
import { ThemeProvider } from '@design-system/theme';
const StorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export const unstable_settings = {
  initialRouteName: StorybookEnabled ? '(storybook)/index' : '(pages)/index',
};

initializeI18n().catch(() => undefined);

function NavigationStack(): ReactElement {
  return (
    <Stack>
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
          <StatusBar style="auto" />
          <NavigationStack />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
