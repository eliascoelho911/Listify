/**
 * FAB (Floating Action Button) Atom Types
 */

import type { PressableProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export type FABSize = 'md' | 'lg';

export interface FABProps extends Omit<PressableProps, 'style'> {
  /**
   * Lucide icon component to display
   */
  icon: LucideIcon;

  /**
   * Size of the FAB
   * @default 'lg'
   */
  size?: FABSize;

  /**
   * Callback when FAB is pressed
   */
  onPress?: () => void;

  /**
   * Accessibility label for the button
   */
  accessibilityLabel?: string;

  /**
   * Test ID for testing
   */
  testID?: string;
}
