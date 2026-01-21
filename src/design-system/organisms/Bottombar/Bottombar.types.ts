/**
 * Bottombar Organism Types
 */

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export interface BottombarProps extends BottomTabBarProps {
  /**
   * Callback when FAB (central button) is pressed
   */
  onFABPress?: () => void;
}
