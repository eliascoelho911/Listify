/**
 * ScreenTitle Atom Component
 *
 * Displays a screen title with optional subtitle for header areas
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { Text } from '../Text/Text';
import { createScreenTitleStyles } from './ScreenTitle.styles';
import type { ScreenTitleProps } from './ScreenTitle.types';

export function ScreenTitle({
  title,
  subtitle,
  testID,
  titleStyle,
  subtitleStyle,
}: ScreenTitleProps): ReactElement {
  const { theme } = useTheme();
  const styles = createScreenTitleStyles(theme);

  return (
    <View style={styles.container} testID={testID}>
      <Text variant="h2" style={[styles.title, titleStyle]}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="caption" color="muted" style={[styles.subtitle, subtitleStyle]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
