/**
 * Badge Atom Component
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme';
import { Text } from '../Text/Text';
import { createBadgeStyles } from './Badge.styles';
import type { BadgeProps } from './Badge.types';

export function Badge({ children, variant = 'default', ...viewProps }: BadgeProps): ReactElement {
  const { theme } = useTheme();
  const styles = createBadgeStyles(theme);

  const badgeStyle = [styles.baseStyles.badge, styles.variantStyles[variant].badge];
  const textStyle = [styles.baseStyles.text, styles.variantStyles[variant].text];

  return (
    <View style={badgeStyle} {...viewProps}>
      {typeof children === 'string' ? <Text style={textStyle}>{children}</Text> : children}
    </View>
  );
}
