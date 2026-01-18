/**
 * Bottombar Organism Types
 */

import type { ViewProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export interface BottombarItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Lucide icon component
   */
  icon: LucideIcon;

  /**
   * Accessibility label
   */
  label: string;

  /**
   * Callback when item is pressed
   */
  onPress: () => void;
}

export interface BottombarProps extends Omit<ViewProps, 'style'> {
  /**
   * Navigation items
   */
  items: BottombarItem[];

  /**
   * Index of the active item
   */
  activeIndex?: number;
}
