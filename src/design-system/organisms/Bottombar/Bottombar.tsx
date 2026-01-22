/**
 * Bottombar Organism Component
 *
 * Floating bottom navigation bar with pill shape, notch cutout, and elevated FAB
 */

import React, { type ReactElement, useCallback, useState } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';
import { Inbox, List, Plus, Search, StickyNote } from 'lucide-react-native';

import { NavigationTab } from '../../atoms/NavigationTab/NavigationTab';
import { useTheme } from '../../theme';
import { BOTTOMBAR_CONFIG, createBottombarStyles } from './Bottombar.styles';
import type { BottombarProps, BottombarTabName } from './Bottombar.types';
import { BottombarFAB } from './BottombarFAB';
import { BottombarNotch } from './BottombarNotch';

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
  const [containerWidth, setContainerWidth] = useState(0);

  const routes = state.routes;
  const leftRoutes = routes.slice(0, 2);
  const rightRoutes = routes.slice(2, 4);

  // Get the current tab name
  const currentTabName = routes[state.index]?.name as BottombarTabName;

  // Handle layout to get container width for SVG
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

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

  return (
    <View
      style={[styles.wrapper, { paddingBottom: insets.bottom + BOTTOMBAR_CONFIG.bottomMargin }]}
    >
      <View style={styles.container} onLayout={handleLayout}>
        {/* SVG Background with notch cutout */}
        <BottombarNotch
          width={containerWidth}
          height={BOTTOMBAR_CONFIG.height}
          fabSize={BOTTOMBAR_CONFIG.fabSize}
        />

        {/* Left tabs */}
        <View style={styles.leftTabs}>{leftRoutes.map((route, idx) => renderTab(route, idx))}</View>

        {/* Center spacer for FAB */}
        <View style={styles.centerSpacer} />

        {/* Right tabs */}
        <View style={styles.rightTabs}>
          {rightRoutes.map((route, idx) => renderTab(route, idx + 2))}
        </View>

        {/* FAB - positioned absolutely above the bar */}
        <View style={styles.fabContainer}>
          <BottombarFAB
            icon={Plus}
            onPress={handleFABPress}
            accessibilityLabel={currentTabName === 'lists' ? 'Add new list' : 'Add new item'}
            testID="fab-add"
          />
        </View>
      </View>
    </View>
  );
}
