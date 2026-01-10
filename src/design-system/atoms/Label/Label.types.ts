/**
 * Label Atom Types
 */

import type { TextProps } from 'react-native';

export interface LabelProps extends Omit<TextProps, 'style'> {
  /**
   * Label text
   */
  children: React.ReactNode;

  /**
   * Required indicator
   */
  required?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;
}
