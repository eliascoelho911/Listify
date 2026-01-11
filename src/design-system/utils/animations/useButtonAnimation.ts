/**
 * useButtonAnimation Hook
 *
 * Provides animation state for button press feedback
 * Returns opacity that can be applied to button style
 */

import { useRef } from 'react';
import { Animated } from 'react-native';

import { useReducedMotion } from './useReducedMotion';

export interface UseButtonAnimationReturn {
  opacity: Animated.Value;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function useButtonAnimation(): UseButtonAnimationReturn {
  const opacity = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  const onPressIn = () => {
    if (reducedMotion) {
      // Instant change if reduced motion is enabled
      opacity.setValue(0.7);
    } else {
      // Smooth animation
      Animated.timing(opacity, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const onPressOut = () => {
    if (reducedMotion) {
      // Instant change if reduced motion is enabled
      opacity.setValue(1);
    } else {
      // Smooth animation
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  return {
    opacity,
    onPressIn,
    onPressOut,
  };
}
