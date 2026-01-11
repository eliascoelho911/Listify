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
 * Using cubic-bezier functions for web and Storybook
 */
export const easings = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
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
  spring: 'Easing.bezier(0.34, 1.56, 0.64, 1)',
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

export const animations: AnimationTokens = {
  durations,
  easings,
  reanimatedEasings,
};
