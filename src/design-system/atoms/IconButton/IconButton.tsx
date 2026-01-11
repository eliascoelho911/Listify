/**
 * IconButton Atom Component
 *
 * Modern icon button with variants, sizes and smooth animations
 * Uses theme tokens exclusively (no hard-coded values)
 */

import React, { type ReactElement, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

import { useTheme } from '../../theme';
import { createIconButtonStyles } from './IconButton.styles';
import type { IconButtonProps } from './IconButton.types';

export function IconButton({
  icon: Icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  isActive = false,
  disabled = false,
  accessibilityLabel,
  ...pressableProps
}: IconButtonProps): ReactElement {
  const { theme } = useTheme();
  const styles = createIconButtonStyles(theme);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const buttonStyle = [
    styles.baseStyles.button,
    styles.sizeStyles[size],
    isActive ? styles.activeVariantStyles[variant] : styles.variantStyles[variant],
    disabled && styles.baseStyles.disabled,
  ];

  const iconColor = styles.iconColorStyles[variant];
  const iconSize = styles.iconSizes[size];

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: theme.animations.durations.fast,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: theme.animations.durations.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: theme.animations.durations.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      {...pressableProps}
    >
      <Animated.View style={[buttonStyle, animatedStyle]}>
        <Icon size={iconSize} color={iconColor} />
      </Animated.View>
    </Pressable>
  );
}
