/**
 * {{NAME}} Atom Types
 */

import type { ViewProps } from 'react-native';

export interface {{NAME}}Props extends Omit<ViewProps, 'style'> {
  /**
   * Component children
   */
  children: React.ReactNode;
}
