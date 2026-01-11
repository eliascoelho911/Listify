/**
 * Input Atom Types
 */

import type { TextInputProps } from 'react-native';

export type InputState = 'default' | 'focus' | 'error' | 'disabled';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /**
   * Input state
   */
  state?: InputState;

  /**
   * Error message
   */
  errorMessage?: string;

  /**
   * Helper text
   */
  helperText?: string;
}
