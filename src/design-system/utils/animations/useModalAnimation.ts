/**
 * useModalAnimation Hook
 *
 * Provides slide + fade animation for modals
 * Returns animated values and control functions
 */

import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { useReducedMotion } from './useReducedMotion';

export interface UseModalAnimationReturn {
  opacity: Animated.Value;
  translateY: Animated.Value;
  show: () => void;
  hide: (onComplete?: () => void) => void;
}

export function useModalAnimation(visible: boolean): UseModalAnimationReturn {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (visible) {
      show();
    }
  }, [visible]);

  const show = () => {
    if (reducedMotion) {
      // Instant show if reduced motion
      opacity.setValue(1);
      translateY.setValue(0);
    } else {
      // Animated show
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const hide = (onComplete?: () => void) => {
    if (reducedMotion) {
      // Instant hide if reduced motion
      opacity.setValue(0);
      translateY.setValue(50);
      onComplete?.();
    } else {
      // Animated hide
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 50,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(onComplete);
    }
  };

  return {
    opacity,
    translateY,
    show,
    hide,
  };
}
