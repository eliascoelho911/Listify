import type { ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from '@app/providers/AppProviders';

export default function RootLayout(): ReactElement {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppProviders>
          <Stack>
            <Stack.Screen name="index" options={{ title: 'Listify' }} />
            <Stack.Screen
              name="item/[id]"
              options={{ title: 'Edit Item', presentation: 'modal' }}
            />
          </Stack>
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
