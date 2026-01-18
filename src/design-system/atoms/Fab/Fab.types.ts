/**
 * Fab Atom Types
 */

import type { TouchableOpacityProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export interface FabProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * Icon component from lucide-react-native
   */
  icon: LucideIcon;

  /**
   * Size variant of the FAB
   * @default 'medium'
   */
  size?: 'small' | 'medium';

  /**
   * Callback when FAB is pressed
   */
  onPress: () => void;

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel: string;

  /**
   * Whether the FAB is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;
}
