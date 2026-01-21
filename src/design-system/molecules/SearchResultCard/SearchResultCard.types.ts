/**
 * SearchResultCard Atom Types
 */

import type { ViewProps } from 'react-native';

export interface SearchResultCardProps extends Omit<ViewProps, 'style'> {
  /**
   * Component children
   */
  children: React.ReactNode;
}
