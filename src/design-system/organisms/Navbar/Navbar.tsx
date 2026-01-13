/**
 * Navbar Organism Component
 *
 * Modern navbar with Neo-Minimal Dark design and animated cyan accent line
 */

import React, { type ReactElement, useEffect, useMemo, useRef } from 'react';
import { Animated, View } from 'react-native';

import { Text } from '@design-system/atoms';

import { IconButton } from '../../atoms/IconButton';
import { useTheme } from '../../theme';
import { createNavbarStyles } from './Navbar.styles';
import type { NavbarProps } from './Navbar.types';

export function Navbar({
  variant = 'default',
  title,
  titleContent,
  leftAction,
  rightActions = [],
  animated = true,
  ...viewProps
}: NavbarProps): ReactElement {
  const { theme } = useTheme();
  const styles = useMemo(() => createNavbarStyles(theme), [theme]);
  const variantConfig = styles.variantStyles[variant];

  const slideAnim = useRef(new Animated.Value(animated ? -64 : 0)).current;
  const fadeAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: theme.animations.durations.normal,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: theme.animations.durations.normal,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animated, slideAnim, fadeAnim, theme.animations.durations.normal]);

  const animatedContainerStyle = {
    transform: [{ translateY: slideAnim }],
    opacity: fadeAnim,
  };

  return (
    <Animated.View style={animatedContainerStyle} {...viewProps}>
      <View
        style={[styles.baseStyles.container, { backgroundColor: variantConfig.backgroundColor }]}
      >
        {/* Left Action */}
        <View style={styles.baseStyles.actionsContainer}>
          {leftAction && (
            <IconButton
              icon={leftAction.icon}
              onPress={leftAction.onPress}
              variant={leftAction.variant || 'ghost'}
              size={variantConfig.iconSize}
              isActive={leftAction.isActive}
              accessibilityLabel={leftAction.label}
            />
          )}
        </View>

        {/* Title Content */}
        <View style={styles.baseStyles.titleContainer}>
          {title && !titleContent && (
            <Text style={[styles.baseStyles.titleText, { color: variantConfig.foregroundColor }]}>
              {title}
            </Text>
          )}
          {titleContent}
        </View>

        {/* Right Actions */}
        <View style={styles.baseStyles.actionsContainer}>
          {rightActions.map((action, index) => (
            <IconButton
              key={index}
              icon={action.icon}
              onPress={action.onPress}
              variant={action.variant || 'ghost'}
              size={variantConfig.iconSize}
              isActive={action.isActive}
              accessibilityLabel={action.label}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}
