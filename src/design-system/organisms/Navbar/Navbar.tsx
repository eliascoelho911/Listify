/**
 * Navbar Organism Component
 *
 * Modern navbar with Neo-Minimal Dark design and animated cyan accent line
 */

import React, { type ReactElement, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { IconButton } from '../../atoms/IconButton';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createNavbarStyles } from './Navbar.styles';
import type { NavbarProps } from './Navbar.types';

export function Navbar({
  title,
  leftAction,
  rightActions = [],
  animated = true,
  ...viewProps
}: NavbarProps): ReactElement {
  const { theme } = useTheme();
  const styles = createNavbarStyles(theme);

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
      <View style={styles.container}>
        {/* Left Action */}
        <View style={styles.actionsContainer}>
          {leftAction && (
            <IconButton
              icon={leftAction.icon}
              onPress={leftAction.onPress}
              variant={leftAction.variant || 'ghost'}
              size="md"
              isActive={leftAction.isActive}
              accessibilityLabel={leftAction.label}
            />
          )}
        </View>

        {/* Title */}
        {title && (
          <View style={styles.centerContent}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
        )}

        {/* Right Actions */}
        <View style={styles.actionsContainer}>
          {rightActions.map((action, index) => (
            <IconButton
              key={index}
              icon={action.icon}
              onPress={action.onPress}
              variant={action.variant || 'ghost'}
              size="md"
              isActive={action.isActive}
              accessibilityLabel={action.label}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}
