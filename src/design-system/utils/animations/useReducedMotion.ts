/**
 * useReducedMotion Hook
 *
 * Detects user's reduced motion preference
 * Returns true if user prefers reduced motion (animations should be disabled)
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial state
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReducedMotion(enabled);
    });

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      setReducedMotion(enabled);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return reducedMotion;
}
