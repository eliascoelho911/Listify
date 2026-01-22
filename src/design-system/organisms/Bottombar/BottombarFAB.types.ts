/**
 * BottombarFAB Types
 */

import type { PressableProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export interface BottombarFABProps extends Omit<PressableProps, 'style'> {
  /**
   * Lucide icon component to display
   */
  icon: LucideIcon;

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
