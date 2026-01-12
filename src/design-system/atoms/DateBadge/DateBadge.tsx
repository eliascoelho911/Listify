/**
 * DateBadge Atom Component
 *
 * Badge de data para separadores em listas (sticky headers).
 * Variante visual do Badge para contexto temporal.
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { Text } from '../Text/Text';
import { createDateBadgeStyles } from './DateBadge.styles';
import type { DateBadgeProps } from './DateBadge.types';

export function DateBadge({
  label,
  variant = 'default',
  ...viewProps
}: DateBadgeProps): ReactElement {
  const { theme } = useTheme();
  const styles = createDateBadgeStyles(theme, variant);

  return (
    <View style={styles.container} {...viewProps}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
