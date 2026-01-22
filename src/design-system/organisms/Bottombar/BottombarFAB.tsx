/**
 * BottombarFAB Component
 *
 * Large FAB (64px) specifically designed for the bottom bar
 * Features cyan glow effect and elevated positioning
 */

import React, { type ReactElement } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme';
import { BOTTOMBAR_CONFIG } from './Bottombar.styles';
import { createBottombarFABStyles } from './BottombarFAB.styles';
import type { BottombarFABProps } from './BottombarFAB.types';

export function BottombarFAB({
  icon: IconComponent,
  onPress,
  accessibilityLabel = 'Add',
  testID,
  ...pressableProps
}: BottombarFABProps): ReactElement {
  const { theme } = useTheme();
  const styles = createBottombarFABStyles(theme);

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
      <IconComponent size={BOTTOMBAR_CONFIG.fabIconSize} color={theme.colors.primaryForeground} />
    </Pressable>
  );
}
