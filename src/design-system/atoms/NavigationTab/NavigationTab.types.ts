/**
 * NavigationTab Atom Types
 */

import type { PressableProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export interface NavigationTabProps extends Omit<PressableProps, 'style'> {
  /**
   * Lucide icon component to display
   */
  icon: LucideIcon;

  /**
   * Tab label text
   */
  label: string;

  /**
   * Whether the tab is currently active
   */
  isActive?: boolean;

  /**
   * Callback when tab is pressed
   */
  onPress?: () => void;

  /**
   * Test ID for testing
   */
  testID?: string;
}
