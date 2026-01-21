/**
 * Tabs Layout
 *
 * Main navigation tabs layout using Expo Router with custom Bottombar.
 * Integrates SmartInputModal with FAB for quick item/list creation.
 */

import { type ReactElement, useCallback } from 'react';
import { Tabs } from 'expo-router';

import { useAppDependencies } from '@app/di';
import type { ParsedInput } from '@domain/common';
import { useSmartInput } from '@presentation/hooks';
import { Bottombar, SmartInputModal } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

export default function TabsLayout(): ReactElement {
  const { theme } = useTheme();
  const { smartInputParser } = useAppDependencies();

  // Handle submission of parsed input
  const handleSubmit = useCallback((parsed: ParsedInput): void => {
    console.debug('[TabsLayout] SmartInput submitted:', parsed);
    // TODO: Create item/list based on parsed input (T094-T097)
  }, []);

  // Handle creation of new list
  const handleCreateList = useCallback((name: string): void => {
    console.debug('[TabsLayout] Create new list:', name);
    // TODO: Create list via repository (US2.2)
  }, []);

  // Smart input hook for managing modal state and parsing
  const {
    value,
    setValue,
    parsed,
    visible,
    open,
    close,
    submit,
    listSuggestions,
    showSuggestions,
    selectList,
    createList,
    isLoading,
  } = useSmartInput({
    parser: smartInputParser,
    onSubmit: handleSubmit,
    onCreateList: handleCreateList,
    availableLists: [], // TODO: Load from listRepository (T094)
  });

  return (
    <>
      <Tabs
        tabBar={(props) => <Bottombar {...props} onFABPress={open} />}
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

      <SmartInputModal
        visible={visible}
        onClose={close}
        onSubmit={submit}
        value={value}
        onChangeText={setValue}
        parsed={parsed}
        listSuggestions={listSuggestions}
        showSuggestions={showSuggestions}
        onSelectList={selectList}
        onCreateList={createList}
        isLoading={isLoading}
      />
    </>
  );
}
