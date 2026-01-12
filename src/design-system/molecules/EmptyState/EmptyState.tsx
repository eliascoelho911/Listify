/**
 * EmptyState Molecule Component
 *
 * Displays a centered message when a list or container has no content.
 * Supports optional icon, title, and subtitle.
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { useTheme } from '../../theme';
import { createEmptyStateStyles } from './EmptyState.styles';
import type { EmptyStateProps } from './EmptyState.types';

export function EmptyState({ icon, title, subtitle, ...viewProps }: EmptyStateProps): ReactElement {
  const { theme } = useTheme();
  const styles = createEmptyStateStyles(theme);

  return (
    <View style={styles.container} {...viewProps}>
      {icon && (
        <View style={styles.iconContainer}>
          <Icon icon={icon} size="lg" color={theme.colors.mutedForeground} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}
