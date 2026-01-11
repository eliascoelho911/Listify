/**
 * Badge Atom Types
 */

import type { ViewProps } from 'react-native';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps extends Omit<ViewProps, 'style'> {
  /**
   * Badge content (text or component)
   */
  children: React.ReactNode;

  /**
   * Badge variant
   */
  variant?: BadgeVariant;
}
