/**
 * Bottombar Organism Types
 */

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

/**
 * Tab names for the bottom bar
 */
export type BottombarTabName = 'index' | 'search' | 'notes' | 'lists';

export interface BottombarProps extends BottomTabBarProps {
  /**
   * Callback when FAB (central button) is pressed
   * @param currentTab - The name of the currently active tab
   */
  onFABPress?: (currentTab: BottombarTabName) => void;
}
