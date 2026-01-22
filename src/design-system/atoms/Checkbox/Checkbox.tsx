/**
 * Checkbox Atom Component
 *
 * A checkbox component for marking items as checked/unchecked.
 * Commonly used in shopping lists to mark items as purchased.
 */

import React, { type ReactElement, useCallback } from 'react';
import { Pressable } from 'react-native';
import { Check } from 'lucide-react-native';

import { useTheme } from '../../theme';
import { createCheckboxStyles, getIconSize } from './Checkbox.styles';
import type { CheckboxProps } from './Checkbox.types';

export function Checkbox({
  checked,
  onToggle,
  disabled = false,
  size = 'md',
  style,
  testID,
}: CheckboxProps): ReactElement {
  const { theme } = useTheme();
  const styles = createCheckboxStyles(theme, { checked, disabled, size });

  const handlePress = useCallback(() => {
    if (!disabled && onToggle) {
      onToggle(!checked);
    }
  }, [checked, disabled, onToggle]);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={checked ? 'Checked' : 'Unchecked'}
      testID={testID}
    >
      {checked && (
        <Check size={getIconSize(size)} color={theme.colors.primaryForeground} strokeWidth={3} />
      )}
    </Pressable>
  );
}
