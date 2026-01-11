/**
 * Icon Atom Types
 */

import type { LucideIcon } from 'lucide-react-native';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  /**
   * Lucide icon component
   */
  icon: LucideIcon;

  /**
   * Icon size
   */
  size?: IconSize;

  /**
   * Icon color (overrides theme default)
   */
  color?: string;

  /**
   * Additional props passed to icon
   */
  iconProps?: Record<string, any>;
}
