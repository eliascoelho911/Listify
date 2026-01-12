/**
 * DeleteConfirmDialog Component
 *
 * Confirmation dialog for deleting a user input.
 */

import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { AlertDialog } from '@design-system/molecules';

export interface DeleteConfirmDialogProps {
  /**
   * Whether the dialog is visible
   */
  visible: boolean;

  /**
   * Callback when delete is confirmed
   */
  onConfirm: () => void;

  /**
   * Callback when delete is cancelled
   */
  onCancel: () => void;

  /**
   * Whether the delete action is in progress
   */
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  visible,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmDialogProps): ReactElement {
  const { t } = useTranslation();

  return (
    <AlertDialog
      visible={visible}
      title={t('inbox.delete.title')}
      description={t('inbox.delete.description')}
      confirmLabel={t('inbox.delete.confirm')}
      cancelLabel={t('inbox.delete.cancel')}
      variant="destructive"
      isLoading={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
