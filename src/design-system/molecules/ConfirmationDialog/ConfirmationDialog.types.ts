/**
 * ConfirmationDialog Molecule Types
 *
 * Dialog de confirmação para ações destrutivas. Inspirado no AlertDialog do Shadcn.
 */

import type { ViewProps } from 'react-native';

export interface ConfirmationDialogButton {
  /**
   * Button label text
   */
  label: string;

  /**
   * Whether this is the primary/confirm action
   */
  primary?: boolean;

  /**
   * Whether this is a destructive action (displayed in red)
   */
  destructive?: boolean;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
}

export interface ConfirmationDialogProps extends Omit<ViewProps, 'style'> {
  /**
   * Whether the dialog is visible
   */
  visible: boolean;

  /**
   * Dialog title
   */
  title: string;

  /**
   * Dialog description/message
   */
  description?: string;

  /**
   * Configuration for the confirm button
   */
  confirmButton: ConfirmationDialogButton;

  /**
   * Configuration for the cancel button
   */
  cancelButton?: ConfirmationDialogButton;

  /**
   * Callback when confirm is pressed
   */
  onConfirm: () => void;

  /**
   * Callback when cancel is pressed or dialog is dismissed
   */
  onCancel: () => void;

  /**
   * Whether to show a loading state on the confirm button
   * @default false
   */
  isLoading?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;
}
