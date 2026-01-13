/**
 * Navbar Organism Types
 */

import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import type { IconButtonSize, IconButtonVariant } from '@design-system/atoms';

export type NavbarVariant = 'default';

export type NavbarIconSize = IconButtonSize;

export interface NavbarAction {
  icon: LucideIcon;
  onPress: () => void;
  label: string;
  variant?: IconButtonVariant;
  isActive?: boolean;
}

export interface NavbarProps extends Omit<ViewProps, 'style'> {
  /**
   * Navbar variant
   */
  variant?: NavbarVariant;

  /**
   * Navbar title as string (optional, centered)
   */
  title?: string;

  /**
   * Navbar title (optional, centered)
   */
  titleContent?: ReactNode;

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
