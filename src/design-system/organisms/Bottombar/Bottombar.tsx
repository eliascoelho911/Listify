/**
 * Bottombar Organism Component
 *
 * A bottom navigation bar with icons and an active indicator.
 * Supports customizable navigation items with Lucide icons.
 */

import React, { type ReactElement } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { useTheme } from '../../theme';
import { createBottombarStyles } from './Bottombar.styles';
import type { BottombarProps } from './Bottombar.types';

export function Bottombar({
  items,
  activeIndex = 0,
  ...viewProps
}: BottombarProps): ReactElement {
  const { theme } = useTheme();
  const styles = createBottombarStyles(theme);

  return (
    <View style={styles.container} {...viewProps}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.itemContainer}
            onPress={item.onPress}
            accessibilityLabel={item.label}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            {isActive && <View style={styles.activeIndicator} />}
            <Icon
              icon={item.icon}
              size="lg"
              color={isActive ? theme.colors.primary : theme.colors.muted}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
