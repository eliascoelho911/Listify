/**
 * PriceBadge Atom Types
 */

import type { StyleProp, ViewStyle } from 'react-native';

export interface PriceBadgeProps {
  /**
   * The price value in the local currency
   */
  price: number;

  /**
   * Currency code (default: 'BRL')
   * @default 'BRL'
   */
  currency?: string;

  /**
   * Locale for formatting (default: 'pt-BR')
   * @default 'pt-BR'
   */
  locale?: string;

  /**
   * Size variant of the badge
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether to show a background
   * @default false
   */
  showBackground?: boolean;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
