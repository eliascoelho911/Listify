/**
 * SearchBar Molecule Component
 *
 * Composes Input + Icon atoms into a search bar
 */

import { Search, X } from 'lucide-react-native';
import React, { type ReactElement, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Input } from '../../atoms/Input/Input';
import { useTheme } from '../../theme';
import { createSearchBarStyles } from './SearchBar.styles';
import type { SearchBarProps } from './SearchBar.types';

export function SearchBar({
  onSearch,
  onClear,
  showClear = true,
  value: controlledValue,
  onChangeText,
  ...inputProps
}: SearchBarProps): ReactElement {
  const { theme } = useTheme();
  const styles = createSearchBarStyles(theme);
  const [internalValue, setInternalValue] = useState('');

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const hasValue = value && value.length > 0;

  const handleChangeText = (text: string) => {
    if (controlledValue === undefined) {
      setInternalValue(text);
    }
    onChangeText?.(text);
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    onClear?.();
    onChangeText?.('');
  };

  const handleSubmitEditing = () => {
    onSearch?.(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon icon={Search} size="md" color={theme.colors['muted-foreground']} />
      </View>

      <Input
        value={value}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmitEditing}
        returnKeyType="search"
        style={[styles.inputWithIcon, hasValue && showClear && styles.inputWithClear]}
        {...inputProps}
      />

      {hasValue && showClear && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Icon icon={X} size="md" color={theme.colors['muted-foreground']} />
        </TouchableOpacity>
      )}
    </View>
  );
}
