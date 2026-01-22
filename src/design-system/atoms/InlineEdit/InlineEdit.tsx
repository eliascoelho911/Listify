/**
 * InlineEdit Atom Component
 *
 * Displays text that can be tapped to enter edit mode.
 * Shows an underlined input when editing.
 */

import React, { type ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Pencil } from 'lucide-react-native';

import { Icon } from '../Icon/Icon';
import { useTheme } from '../../theme';
import { createInlineEditStyles } from './InlineEdit.styles';
import type { InlineEditProps } from './InlineEdit.types';

export function InlineEdit({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Tap to edit',
  isEditing: controlledIsEditing,
  onEditingChange,
  variant = 'default',
  maxLength,
  multiline = false,
  textStyle,
  style,
  disabled = false,
  ...viewProps
}: InlineEditProps): ReactElement {
  const { theme } = useTheme();
  const styles = createInlineEditStyles(theme, variant);
  const inputRef = useRef<TextInput>(null);

  // Support both controlled and uncontrolled editing state
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const isEditing = controlledIsEditing ?? internalIsEditing;

  const setIsEditing = useCallback(
    (editing: boolean) => {
      if (onEditingChange) {
        onEditingChange(editing);
      } else {
        setInternalIsEditing(editing);
      }
    },
    [onEditingChange],
  );

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      setIsEditing(true);
    }
  }, [disabled, setIsEditing]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    onSubmit?.(value);
  }, [setIsEditing, onSubmit, value]);

  const handleSubmitEditing = useCallback(() => {
    setIsEditing(false);
    onSubmit?.(value);
  }, [setIsEditing, onSubmit, value]);

  if (isEditing) {
    return (
      <View style={[styles.container, style]} {...viewProps}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={[styles.input, textStyle]}
            value={value}
            onChangeText={onChangeText}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmitEditing}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.mutedForeground}
            maxLength={maxLength}
            multiline={multiline}
            returnKeyType={multiline ? 'default' : 'done'}
            blurOnSubmit={!multiline}
            autoFocus
            selectTextOnFocus
          />
        </View>
      </View>
    );
  }

  return (
    <Pressable
      style={[styles.container, disabled && styles.disabled, style]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${value || placeholder}`}
      accessibilityHint="Tap to edit"
      {...viewProps}
    >
      <View style={styles.textContainer}>
        {value ? (
          <Text style={[styles.text, textStyle]} numberOfLines={multiline ? undefined : 1}>
            {value}
          </Text>
        ) : (
          <Text style={[styles.placeholder, textStyle]}>{placeholder}</Text>
        )}
      </View>
      {!disabled && (
        <View style={styles.editIcon}>
          <Icon icon={Pencil} size="sm" color={theme.colors.mutedForeground} />
        </View>
      )}
    </Pressable>
  );
}
