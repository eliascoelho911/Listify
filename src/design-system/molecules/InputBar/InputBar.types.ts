/**
 * InputBar Molecule Types
 *
 * Molecule que combina Input + IconButton para entrada de dados com ação de envio.
 * Reutilizável em qualquer contexto que precise de input com botão de ação.
 */

import type { TextInputProps, ViewProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import type { IconButtonVariant } from '../../atoms/IconButton/IconButton.types';

export interface InputBarProps extends Omit<ViewProps, 'style'> {
  /**
   * Placeholder text for the input
   */
  placeholder?: string;

  /**
   * Current value of the input
   */
  value: string;

  /**
   * Callback when text changes
   */
  onChangeText: (text: string) => void;

  /**
   * Callback when submit button is pressed
   */
  onSubmit: () => void;

  /**
   * Whether the submit action is in progress
   */
  isSubmitting?: boolean;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Icon for the submit button (defaults to Send)
   */
  submitIcon?: LucideIcon;

  /**
   * Variant for the submit button
   */
  submitVariant?: IconButtonVariant;

  /**
   * Accessibility label for the submit button
   */
  submitAccessibilityLabel?: string;

  /**
   * Additional TextInput props
   */
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'editable'>;

  /**
   * Whether to auto focus the input
   */
  autoFocus?: boolean;

  /**
   * Callback when input gains focus
   */
  onFocus?: () => void;

  /**
   * Callback when input loses focus
   */
  onBlur?: () => void;
}
