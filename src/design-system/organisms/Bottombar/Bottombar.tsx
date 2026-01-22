/**
 * Bottombar Organism Component
 *
 * Floating bottom navigation bar with pill shape and elevated FAB
 */

import React, { type ReactElement, useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';
import { Inbox, List, Plus, Search, StickyNote } from 'lucide-react-native';

import { FAB } from '@design-system/atoms';

import { NavigationTab } from '../../atoms/NavigationTab/NavigationTab';
import { useTheme } from '../../theme';
import { BOTTOMBAR_CONFIG, createBottombarStyles } from './Bottombar.styles';
import type { BottombarProps, BottombarTabName } from './Bottombar.types';

const TAB_ICONS: Record<string, LucideIcon> = {
  index: Inbox,
  search: Search,
  notes: StickyNote,
  lists: List,
};

const TAB_LABELS: Record<string, string> = {
  index: 'Inbox',
  search: 'Buscar',
  notes: 'Notas',
  lists: 'Listas',
};

export function Bottombar({
  state,
  descriptors,
  navigation,
  onFABPress,
}: BottombarProps): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createBottombarStyles(theme);

  const routes = state.routes;

  // Get the current tab name
  const currentTabName = routes[state.index]?.name as BottombarTabName;

  // Handle FAB press with current tab context
  const handleFABPress = useCallback(() => {
    onFABPress?.(currentTabName);
  }, [onFABPress, currentTabName]);

  const renderTab = (route: (typeof routes)[number], index: number): ReactElement => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    const routeName = route.name;
    const icon = TAB_ICONS[routeName] || Inbox;
    const label =
      TAB_LABELS[routeName] ||
      (options.tabBarLabel !== undefined
        ? String(options.tabBarLabel)
        : options.title !== undefined
          ? options.title
          : route.name);

    const onPress = (): void => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = (): void => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <NavigationTab
        key={route.key}
        icon={icon}
        label={label}
        isActive={isFocused}
        onPress={onPress}
        onLongPress={onLongPress}
        testID={`tab-${routeName}`}
      />
    );
  };

  // Insert FAB in the middle (after first 2 tabs)
  const renderItems = (): ReactElement[] => {
    const items: ReactElement[] = [];

    routes.forEach((route, index) => {
      // Add FAB after the second tab
      if (index === 2) {
        items.push(
          <View key="fab" style={styles.item}>
            <FAB
              size="md"
              icon={Plus}
              onPress={handleFABPress}
              accessibilityLabel={currentTabName === 'lists' ? 'Add new list' : 'Add new item'}
              testID="fab-add"
            />
          </View>,
        );
      }

      items.push(
        <View key={route.key} style={styles.item}>
          {renderTab(route, index)}
        </View>,
      );
    });

    return items;
  };

  return (
    <View
      style={[styles.wrapper, { paddingBottom: insets.bottom + BOTTOMBAR_CONFIG.bottomMargin }]}
    >
      <View style={styles.container}>{renderItems()}</View>
    </View>
  );
}
