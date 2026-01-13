import type { ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppDependenciesProvider } from '@app/di/AppDependenciesProvider';
import { initializeI18n } from '@app/i18n/i18n';
import { ThemeProvider } from '@design-system/theme';

initializeI18n().catch(() => undefined);

function NavigationStack(): ReactElement {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout(): ReactElement {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppDependenciesProvider>
            <StatusBar style="light" />
            <NavigationStack />
          </AppDependenciesProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
