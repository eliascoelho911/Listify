/**
 * FilterChip Atom Component
 *
 * A selectable chip component used for filtering search results.
 * Can be toggled between selected and unselected states.
 */

import React, { type ReactElement, useCallback } from 'react';
import { Pressable } from 'react-native';

import { useTheme } from '../../theme';
import { Icon } from '../Icon/Icon';
import { Text } from '../Text/Text';
import { createFilterChipStyles } from './FilterChip.styles';
import type { FilterChipProps } from './FilterChip.types';

export function FilterChip({
  label,
  selected = false,
  onPress,
  icon,
  disabled = false,
  style,
  ...viewProps
}: FilterChipProps): ReactElement {
  const { theme } = useTheme();
  const styles = createFilterChipStyles(theme, selected, disabled);

  const handlePress = useCallback(() => {
    if (!disabled) {
      onPress?.();
    }
  }, [disabled, onPress]);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={`${label} filter${selected ? ', selected' : ''}`}
      {...viewProps}
    >
      {icon && (
        <Icon
          icon={icon}
          size="sm"
          color={selected ? theme.colors.primary : theme.colors.foreground}
        />
      )}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
