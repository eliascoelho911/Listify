/**
 * AlertDialog Molecule Types
 *
 * Diálogo de confirmação. Baseado no AlertDialog do Shadcn.
 */

import type { ViewProps } from 'react-native';

export type AlertDialogVariant = 'default' | 'destructive';

export interface AlertDialogProps extends Omit<ViewProps, 'style'> {
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
   * Label for the confirm button
   * @default 'Confirm'
   */
  confirmLabel?: string;

  /**
   * Label for the cancel button
   * @default 'Cancel'
   */
  cancelLabel?: string;

  /**
   * Callback when confirm is pressed
   */
  onConfirm: () => void;

  /**
   * Callback when cancel is pressed or dialog is dismissed
   */
  onCancel: () => void;

  /**
   * Visual variant for the confirm button
   * @default 'default'
   */
  variant?: AlertDialogVariant;

  /**
   * Whether the confirm action is in progress
   */
  isLoading?: boolean;
}
