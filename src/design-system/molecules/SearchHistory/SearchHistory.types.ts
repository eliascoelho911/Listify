/**
 * SearchHistory Atom Types
 */

import type { ViewProps } from 'react-native';

export interface SearchHistoryProps extends Omit<ViewProps, 'style'> {
  /**
   * Component children
   */
  children: React.ReactNode;
}
