/**
 * Fab Atom Component
 */

import React, { type ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';

import { useTheme } from '../../theme';
import { createFabStyles } from './Fab.styles';
import type { FabProps } from './Fab.types';

export function Fab({
  icon: Icon,
  size = 'medium',
  onPress,
  accessibilityLabel,
  disabled = false,
  testID,
  ...touchableProps
}: FabProps): ReactElement {
  const { theme } = useTheme();
  const styles = createFabStyles(theme);

  const iconSize = size === 'small' ? theme.spacing.lg + theme.spacing.xs : theme.spacing.xl;

  return (
    <TouchableOpacity
      style={[styles.container, styles[size], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      testID={testID}
      {...touchableProps}
    >
      <Icon size={iconSize} color={theme.colors.primaryForeground} />
    </TouchableOpacity>
  );
}
