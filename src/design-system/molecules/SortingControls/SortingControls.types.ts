/**
 * SortingControls Molecule Types
 *
 * Controls for changing sort/group options in list views.
 * Used in Inbox, Notes, Lists screens.
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export type SortDirection = 'asc' | 'desc';

export interface SortOption<T extends string = string> {
  /**
   * Unique value for this sort option
   */
  value: T;

  /**
   * Display label
   */
  label: string;

  /**
   * Optional icon component
   */
  icon?: LucideIcon;
}

export interface SortingControlsProps<T extends string = string> extends Omit<ViewProps, 'style'> {
  /**
   * Available sort options
   */
  options: SortOption<T>[];

  /**
   * Currently selected sort value
   */
  selectedValue: T;

  /**
   * Current sort direction
   */
  sortDirection: SortDirection;

  /**
   * Callback when sort option changes
   */
  onSortChange: (value: T) => void;

  /**
   * Callback when sort direction toggles
   */
  onDirectionToggle: () => void;

  /**
   * Label shown before the controls
   * @default 'Ordenar por'
   */
  label?: string;

  /**
   * Whether the controls are disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;
}
