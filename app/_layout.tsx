import type { ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { initializeI18n } from '@app/i18n/i18n';
// import { useDependencies } from '@app/providers/AppProviders';

initializeI18n().catch(() => undefined);

// function NavigationStack(): ReactElement {
//   // const { t, i18n } = useTranslation();
//   // const deps = useDependencies();
//   return (
//     <ShoppingListStoreProvider
//       repository={deps.shoppingRepository}
//       getLocale={() => i18n.language ?? FALLBACK_LOCALE}
//     >
//       <Stack>
//         <Stack.Screen name="index" options={{ title: t('navigation.homeTitle') }} />
//         <Stack.Screen
//           name="item/[id]"
//           options={{ title: t('navigation.editItemTitle'), presentation: 'modal' }}
//         />
//       </Stack>
//     </ShoppingListStoreProvider>
//   );
// }

export default function RootLayout(): ReactElement {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        {/* <AppProviders>
          <NavigationStack />
        </AppProviders> */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
