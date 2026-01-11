/**
 * Button Atom Component
 *
 * Shadcn-style button with variants and sizes
 * Uses theme tokens exclusively (no hard-coded values)
 */

import React, { type ReactElement } from 'react';
import { ActivityIndicator, StyleProp, TextStyle, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../theme';
import { Text } from '../Text/Text';
import { createButtonStyles } from './Button.styles';
import type { ButtonProps } from './Button.types';

export function Button({
  variant = 'default',
  size = 'md',
  children,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  ...touchableProps
}: ButtonProps): ReactElement {
  const { theme } = useTheme();
  const styles = createButtonStyles(theme);

  const buttonStyle = [
    styles.baseStyles.button,
    styles.variantStyles[variant],
    size !== 'md' && styles.sizeStyles[size],
    disabled && styles.baseStyles.disabled,
    loading && styles.baseStyles.loading,
  ];

  const textStyle: StyleProp<TextStyle> = [
    styles.baseStyles.text,
    styles.textColorStyles[variant],
    size !== 'md' && { fontSize: styles.sizeStyles[size].fontSize },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={styles.textColorStyles[variant].color}
          size={size === 'sm' ? 'small' : 'small'}
        />
      );
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
        {icon && iconPosition === 'left' && icon}
        {typeof children === 'string' ? <Text style={textStyle}>{children}</Text> : children}
        {icon && iconPosition === 'right' && icon}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...touchableProps}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
