/**
 * Text Atom Component
 */

import React, { type ReactElement } from 'react';
import { type AccessibilityRole, Text as RNText } from 'react-native';

import { useTheme } from '../../theme';
import { createTextStyles } from './Text.styles';
import type { TextProps, TextVariant } from './Text.types';

const HEADING_VARIANTS: TextVariant[] = ['h1', 'h2', 'h3', 'h4'];

export function Text({
  children,
  variant = 'body',
  color = 'foreground',
  weight,
  align,
  style,
  accessibilityRole,
  ...textProps
}: TextProps): ReactElement {
  const { theme } = useTheme();
  const styles = createTextStyles(theme);

  const variantStyle = styles.variantStyles[variant];

  const textStyle = [
    styles.baseStyles.text,
    variantStyle,
    styles.colorStyles[color],
    weight && styles.weightStyles[weight],
    align && styles.alignStyles[align],
    style,
  ];

  const resolvedAccessibilityRole: AccessibilityRole | undefined =
    accessibilityRole ?? (HEADING_VARIANTS.includes(variant) ? 'header' : undefined);

  return (
    <RNText style={textStyle} accessibilityRole={resolvedAccessibilityRole} {...textProps}>
      {children}
    </RNText>
  );
}
