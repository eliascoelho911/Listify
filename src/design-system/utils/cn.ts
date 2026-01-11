/**
 * Classnames Utility
 *
 * Simplified utility for merging React Native styles
 * Similar to clsx/classnames for web, but adapted for RN StyleSheet
 */

import type { StyleProp } from 'react-native';

/**
 * Merge multiple styles into a single array
 * Filters out falsy values for conditional styling
 *
 * @example
 * const buttonStyle = cn(
 *   styles.button,
 *   isActive && styles.active,
 *   isDisabled && styles.disabled
 * );
 */
export function cn<T>(...styles: (StyleProp<T> | false | undefined | null)[]): StyleProp<T> {
  return styles.filter(Boolean) as StyleProp<T>;
}
