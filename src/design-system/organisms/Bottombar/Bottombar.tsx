/**
 * Bottombar Organism Component
 *
 * Custom bottom navigation bar with FAB in the center
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';
import { Inbox, List, Plus, Search, StickyNote } from 'lucide-react-native';

import { FAB } from '../../atoms/FAB/FAB';
import { NavigationTab } from '../../atoms/NavigationTab/NavigationTab';
import { useTheme } from '../../theme';
import { createBottombarStyles } from './Bottombar.styles';
import type { BottombarProps } from './Bottombar.types';

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
  const leftRoutes = routes.slice(0, 2);
  const rightRoutes = routes.slice(2, 4);

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

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.leftTabs}>{leftRoutes.map((route, idx) => renderTab(route, idx))}</View>

      <View style={styles.fabContainer}>
        <FAB icon={Plus} onPress={onFABPress} accessibilityLabel="Add new item" testID="fab-add" />
      </View>

      <View style={styles.rightTabs}>
        {rightRoutes.map((route, idx) => renderTab(route, idx + 2))}
      </View>
    </View>
  );
}
