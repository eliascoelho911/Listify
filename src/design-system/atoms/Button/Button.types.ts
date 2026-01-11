/**
 * Button Atom Types
 */

import type { ReactElement } from 'react';
import type { TouchableOpacityProps } from 'react-native';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * Button variant (Shadcn style)
   */
  variant?: ButtonVariant;

  /**
   * Button size
   */
  size?: ButtonSize;

  /**
   * Button content (text or icon)
   */
  children: React.ReactNode;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Icon element (optional)
   */
  icon?: ReactElement;

  /**
   * Icon position
   */
  iconPosition?: 'left' | 'right';
}
