/**
 * ContextMenu Molecule Types
 *
 * Menu de opções contextual (long press). Inspirado no DropdownMenu do Shadcn.
 */

import type { ViewProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export interface ContextMenuItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Display label for the item
   */
  label: string;

  /**
   * Optional icon to display before the label
   */
  icon?: LucideIcon;

  /**
   * Whether this is a destructive action (displayed in red)
   */
  destructive?: boolean;

  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
}

export interface ContextMenuProps extends Omit<ViewProps, 'style'> {
  /**
   * List of menu items
   */
  items: ContextMenuItem[];

  /**
   * Whether the menu is visible
   */
  visible: boolean;

  /**
   * Callback when the menu is closed
   */
  onClose: () => void;

  /**
   * Callback when an item is selected
   */
  onSelect: (item: ContextMenuItem) => void;

  /**
   * Optional title for the menu
   */
  title?: string;
}
