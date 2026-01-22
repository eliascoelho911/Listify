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

import { IconButton } from '@design-system/atoms';

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
  search: 'Search',
  notes: 'Notes',
  lists: 'Lists',
};

export function Bottombar({ state, navigation, onFABPress }: BottombarProps): ReactElement {
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
    const isFocused = state.index === index;

    const routeName = route.name;
    const icon = TAB_ICONS[routeName] || Inbox;
    const label = TAB_LABELS[routeName] || routeName;

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

    return (
      <IconButton
        icon={icon}
        isActive={isFocused}
        onPress={onPress}
        variant="ghost"
        size="md"
        accessibilityLabel={label}
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
            <IconButton
              icon={Plus}
              variant="accent"
              size="lg"
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
