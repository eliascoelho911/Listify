/**
 * NavigationTab Atom Component
 *
 * Individual tab item for bottom navigation bar
 */

import React, { type ReactElement } from 'react';
import { Pressable } from 'react-native';

import { useTheme } from '../../theme';
import { Text } from '../Text/Text';
import { createNavigationTabStyles, getIconColor } from './NavigationTab.styles';
import type { NavigationTabProps } from './NavigationTab.types';

export function NavigationTab({
  icon: IconComponent,
  label,
  isActive = false,
  onPress,
  testID,
  ...pressableProps
}: NavigationTabProps): ReactElement {
  const { theme } = useTheme();
  const styles = createNavigationTabStyles(theme, isActive);
  const iconColor = getIconColor(theme, isActive);

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={label}
      testID={testID}
      {...pressableProps}
    >
      <IconComponent size={24} color={iconColor} />
      <Text variant="caption" style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}
