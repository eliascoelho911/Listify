/**
 * Logo Atom Types
 *
 * Logo "Listify" estilizado.
 */

import type { ViewProps } from 'react-native';

export type LogoSize = 'sm' | 'md' | 'lg';

export interface LogoProps extends Omit<ViewProps, 'style'> {
  /**
   * Size variant of the logo
   * @default 'md'
   */
  size?: LogoSize;
}
