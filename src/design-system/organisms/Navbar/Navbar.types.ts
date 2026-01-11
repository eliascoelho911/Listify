/**
 * Navbar Organism Types
 */

import type { ViewProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import type { IconButtonVariant } from '../../atoms/IconButton';

export interface NavbarAction {
  icon: LucideIcon;
  onPress: () => void;
  label: string;
  variant?: IconButtonVariant;
  isActive?: boolean;
}

export interface NavbarProps extends Omit<ViewProps, 'style'> {
  /**
   * Navbar title (optional, centered)
   */
  title?: string;

  /**
   * Left action (typically back button)
   */
  leftAction?: NavbarAction;

  /**
   * Right actions (typically settings, menu, etc)
   */
  rightActions?: NavbarAction[];

  /**
   * Whether to animate navbar entrance
   */
  animated?: boolean;
}
