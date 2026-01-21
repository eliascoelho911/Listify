/**
 * FilterChip Atom Types
 *
 * A selectable chip component used for filtering search results.
 * Can be toggled between selected and unselected states.
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export interface FilterChipProps extends Omit<ViewProps, 'style'> {
  /**
   * The label text to display in the chip
   */
  label: string;

  /**
   * Whether the chip is currently selected
   */
  selected?: boolean;

  /**
   * Callback when the chip is pressed
   */
  onPress?: () => void;

  /**
   * Optional icon to display before the label
   */
  icon?: LucideIcon;

  /**
   * Whether the chip is disabled
   */
  disabled?: boolean;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;
}
