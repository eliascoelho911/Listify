/**
 * FAB (Floating Action Button) Atom Component
 *
 * Primary action button for the bottom navigation bar
 */

import React, { type ReactElement } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { createFABStyles, getIconSize } from './FAB.styles';
import type { FABProps } from './FAB.types';

export function FAB({
  icon: IconComponent,
  size = 'lg',
  onPress,
  accessibilityLabel = 'Add',
  testID,
  ...pressableProps
}: FABProps): ReactElement {
  const { theme } = useTheme();
  const styles = createFABStyles(theme, size);
  const iconSize = getIconSize(size);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container as StyleProp<ViewStyle>,
        pressed && (styles.pressed as StyleProp<ViewStyle>),
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      {...pressableProps}
    >
      <IconComponent size={iconSize} color={theme.colors.primaryForeground} />
    </Pressable>
  );
}
