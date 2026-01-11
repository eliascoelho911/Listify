/**
 * FormField Molecule Component
 *
 * Composes Label + Input atoms into a complete form field
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { Input } from '../../atoms/Input/Input';
import { Label } from '../../atoms/Label/Label';
import { useTheme } from '../../theme';
import { createFormFieldStyles } from './FormField.styles';
import type { FormFieldProps } from './FormField.types';

export function FormField({
  label,
  required = false,
  errorMessage,
  helperText,
  inputProps,
  labelProps,
}: FormFieldProps): ReactElement {
  const { theme } = useTheme();
  const styles = createFormFieldStyles(theme);

  const inputState = errorMessage ? 'error' : 'default';

  return (
    <View style={styles.container}>
      <Label required={required} {...labelProps}>
        {label}
      </Label>
      <Input
        state={inputState}
        errorMessage={errorMessage}
        helperText={helperText}
        {...inputProps}
      />
    </View>
  );
}
