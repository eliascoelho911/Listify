/**
 * InputOptionsMenu Component
 *
 * Context menu for user input actions (edit, delete).
 */

import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, Trash2 } from 'lucide-react-native';

import type { UserInput } from '@domain/inbox/entities';
import { ContextMenu, type ContextMenuItem } from '@design-system/molecules';

export interface InputOptionsMenuProps {
  /**
   * The input being acted upon
   */
  input: UserInput | null;

  /**
   * Whether the menu is visible
   */
  visible: boolean;

  /**
   * Callback when the menu is closed
   */
  onClose: () => void;

  /**
   * Callback when edit is selected
   */
  onEdit: (input: UserInput) => void;

  /**
   * Callback when delete is selected
   */
  onDelete: (input: UserInput) => void;
}

export function InputOptionsMenu({
  input,
  visible,
  onClose,
  onEdit,
  onDelete,
}: InputOptionsMenuProps): ReactElement {
  const { t } = useTranslation();

  const handleSelect = (item: ContextMenuItem) => {
    if (!input) return;

    if (item.id === 'edit') {
      onEdit(input);
    } else if (item.id === 'delete') {
      onDelete(input);
    }
  };

  const items: ContextMenuItem[] = [
    {
      id: 'edit',
      label: t('inbox.actions.edit'),
      icon: Edit2,
    },
    {
      id: 'delete',
      label: t('inbox.actions.delete'),
      icon: Trash2,
      destructive: true,
    },
  ];

  return <ContextMenu items={items} visible={visible} onClose={onClose} onSelect={handleSelect} />;
}
