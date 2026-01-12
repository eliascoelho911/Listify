/**
 * DateBadge Atom Types
 *
 * Badge de data para separadores em listas (sticky headers).
 * Variante visual do Badge para contexto temporal.
 */

import type { ViewProps } from 'react-native';

export type DateBadgeVariant = 'today' | 'yesterday' | 'default';

export interface DateBadgeProps extends Omit<ViewProps, 'style'> {
  /**
   * Label text to display (e.g., "Hoje", "Ontem", "12 Jan")
   */
  label: string;

  /**
   * Visual variant based on temporal context
   * @default 'default'
   */
  variant?: DateBadgeVariant;
}
