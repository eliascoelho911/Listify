/**
 * SearchInput Molecule Component
 *
 * A search input field with search icon, clear button, and auto-focus support.
 */

import React, { type ReactElement, useCallback, useEffect, useRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { useTheme } from '../../theme';
import { createSearchInputStyles } from './SearchInput.styles';
import type { SearchInputProps } from './SearchInput.types';

export function SearchInput({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = 'Search...',
  autoFocus = false,
  style,
  testID,
}: SearchInputProps): ReactElement {
  const { theme } = useTheme();
  const styles = createSearchInputStyles(theme);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = useCallback(() => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  }, [onChangeText, onClear]);

  const handleSubmitEditing = useCallback(() => {
    if (value.trim()) {
      onSubmit?.();
    }
  }, [value, onSubmit]);

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Icon icon={Search} size="md" color={theme.colors.mutedForeground} />
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.mutedForeground}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search input"
        accessibilityHint="Enter search query"
        testID={testID ? `${testID}-input` : undefined}
      />
      {value.length > 0 && (
        <Pressable
          style={styles.iconButton}
          onPress={handleClear}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
          testID={testID ? `${testID}-clear` : undefined}
        >
          <Icon icon={X} size="sm" color={theme.colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
}
