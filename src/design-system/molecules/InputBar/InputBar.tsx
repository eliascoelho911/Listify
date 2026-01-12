/**
 * InputBar Molecule Component
 *
 * Molecule que combina Input + IconButton para entrada de dados com ação de envio.
 * Reutilizável em qualquer contexto que precise de input com botão de ação.
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';
import { Send } from 'lucide-react-native';

import { IconButton } from '../../atoms/IconButton/IconButton';
import { Input } from '../../atoms/Input/Input';
import { useTheme } from '../../theme';
import { createInputBarStyles } from './InputBar.styles';
import type { InputBarProps } from './InputBar.types';

export function InputBar({
  placeholder,
  value,
  onChangeText,
  onSubmit,
  isSubmitting = false,
  disabled = false,
  submitIcon: SubmitIcon = Send,
  submitVariant = 'accent',
  submitAccessibilityLabel = 'Submit',
  inputProps,
  autoFocus,
  onFocus,
  onBlur,
  ...viewProps
}: InputBarProps): ReactElement {
  const { theme } = useTheme();
  const styles = createInputBarStyles(theme);

  const isSubmitDisabled = disabled || isSubmitting || value.trim().length === 0;

  const handleSubmitEditing = () => {
    if (!isSubmitDisabled) {
      onSubmit();
    }
  };

  return (
    <View style={styles.container} {...viewProps}>
      <View style={styles.inputContainer}>
        <Input
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled && !isSubmitting}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmitEditing={handleSubmitEditing}
          returnKeyType="send"
          blurOnSubmit={false}
          {...inputProps}
        />
      </View>
      <View style={styles.submitButton}>
        <IconButton
          icon={SubmitIcon}
          onPress={onSubmit}
          variant={submitVariant}
          size="md"
          disabled={isSubmitDisabled}
          accessibilityLabel={submitAccessibilityLabel}
        />
      </View>
    </View>
  );
}
