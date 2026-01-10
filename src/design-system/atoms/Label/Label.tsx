/**
 * Label Atom Component
 */

import React, { type ReactElement } from 'react';
import { Text } from 'react-native';

import { useTheme } from '../../theme';
import { createLabelStyles } from './Label.styles';
import type { LabelProps } from './Label.types';

export function Label({ children, required = false, disabled = false, ...textProps }: LabelProps): ReactElement {
  const { theme } = useTheme();
  const styles = createLabelStyles(theme);

  const labelStyle = [styles.label, disabled && styles.disabled];

  return (
    <Text style={labelStyle} {...textProps}>
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
}
