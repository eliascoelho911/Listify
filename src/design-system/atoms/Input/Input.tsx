/**
 * Input Atom Component
 */

import React, { type ReactElement, useState } from 'react';
import { TextInput, View } from 'react-native';

import { useTheme } from '../../theme';
import { Text } from '../Text/Text';
import { createInputStyles } from './Input.styles';
import type { InputProps } from './Input.types';

export function Input({
  state = 'default',
  errorMessage,
  helperText,
  editable = true,
  style,
  ...textInputProps
}: InputProps): ReactElement {
  const { theme } = useTheme();
  const styles = createInputStyles(theme);
  const [isFocused, setIsFocused] = useState(false);

  const currentState = !editable
    ? 'disabled'
    : state === 'error'
      ? 'error'
      : isFocused
        ? 'focus'
        : 'default';

  const inputStyle = [styles.baseStyles.input, styles.stateStyles[currentState], style];

  return (
    <View>
      <TextInput
        style={inputStyle}
        placeholderTextColor={theme.colors.mutedForeground}
        editable={editable}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...textInputProps}
      />
      {errorMessage && <Text style={styles.baseStyles.errorText}>{errorMessage}</Text>}
      {helperText && !errorMessage && (
        <Text style={styles.baseStyles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}
