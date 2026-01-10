/**
 * Navbar Organism Types
 */

import type { ViewProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export interface NavbarAction {
  icon: LucideIcon;
  onPress: () => void;
  label: string;
}

export interface NavbarProps extends Omit<ViewProps, 'style'> {
  /**
   * Navbar title
   */
  title?: string;

  /**
   * Left actions (typically back button or menu)
   */
  leftActions?: NavbarAction[];

  /**
   * Right actions (typically settings, notifications, etc)
   */
  rightActions?: NavbarAction[];

  /**
   * Whether to show shadow/border
   */
  showBorder?: boolean;
}
