import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { initializeI18n } from '@app/i18n/i18n';
import { AppProviders } from '@app/providers/AppProviders';

initializeI18n().catch(() => undefined);

export default function RootLayout(): ReactElement {
  const { t } = useTranslation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppProviders>
          <Stack>
            <Stack.Screen name="index" options={{ title: t('navigation.homeTitle') }} />
            <Stack.Screen
              name="item/[id]"
              options={{ title: t('navigation.editItemTitle'), presentation: 'modal' }}
            />
          </Stack>
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
