/**
 * ProfileButton Molecule Types
 */

import type { ImageSourcePropType } from 'react-native';

export type ProfileButtonSize = 'sm' | 'md' | 'lg';

export interface ProfileButtonProps {
  /**
   * User's display name (used for initials if no avatar)
   */
  displayName?: string;

  /**
   * Avatar image source (optional)
   */
  avatarSource?: ImageSourcePropType;

  /**
   * Button size
   * @default 'md'
   */
  size?: ProfileButtonSize;

  /**
   * Called when button is pressed
   */
  onPress?: () => void;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Test ID for testing
   */
  testID?: string;
}
