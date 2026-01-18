/**
 * Bottombar Atom Types
 */

import type { ViewProps } from 'react-native';

export interface BottombarProps extends Omit<ViewProps, 'style'> {
  /**
   * Component children
   */
  children: React.ReactNode;
}
