/**
 * FormField Molecule Types
 */

import type { InputProps } from '../../atoms/Input/Input.types';
import type { LabelProps } from '../../atoms/Label/Label.types';

export interface FormFieldProps {
  /**
   * Field label text
   */
  label: string;

  /**
   * Whether field is required
   */
  required?: boolean;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Helper text to display
   */
  helperText?: string;

  /**
   * Input props (forwarded to Input atom)
   */
  inputProps?: Omit<InputProps, 'state' | 'errorMessage' | 'helperText'>;

  /**
   * Label props (forwarded to Label atom)
   */
  labelProps?: Omit<LabelProps, 'children' | 'required'>;
}
