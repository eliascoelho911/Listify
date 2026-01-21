/**
 * ListCard Molecule Types
 *
 * Card component for displaying list information in the Lists screen.
 */

import type { PressableProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import type { List, ListType } from '@domain/list';

export interface ListCardProps extends Omit<PressableProps, 'style'> {
  /**
   * The list entity to display
   */
  list: List;

  /**
   * Optional item count to display
   */
  itemCount?: number;

  /**
   * Callback when the card is pressed
   */
  onPress?: (list: List) => void;

  /**
   * Callback when the card is long pressed
   */
  onLongPress?: (list: List) => void;

  /**
   * Whether the card is currently selected
   * @default false
   */
  selected?: boolean;

  /**
   * Custom icon to override the default list type icon
   */
  customIcon?: LucideIcon;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Mapping of list types to their display information
 */
export interface ListTypeInfo {
  icon: LucideIcon;
  colorKey: string;
  labelKey: string;
}

export type ListTypeInfoMap = Record<ListType, ListTypeInfo>;
