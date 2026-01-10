/**
 * Design System Animation Tokens
 *
 * Durações e easing curves para animações consistentes
 */

/**
 * Animation durations (in milliseconds)
 */
export const durations = {
  fast: 150,
  normal: 300,
  slow: 500,
};

/**
 * Easing curves for animations
 * Using standard easing functions
 */
export const easings = {
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',
};

/**
 * React Native Reanimated easing equivalents
 * For use with Reanimated animations
 */
export const reanimatedEasings = {
  easeIn: 'Easing.in(Easing.ease)',
  easeOut: 'Easing.out(Easing.ease)',
  easeInOut: 'Easing.inOut(Easing.ease)',
  linear: 'Easing.linear',
};

/**
 * Animation tokens type for TypeScript
 */
export type AnimationTokens = {
  durations: typeof durations;
  easings: typeof easings;
  reanimatedEasings: typeof reanimatedEasings;
};
