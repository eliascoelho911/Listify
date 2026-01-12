/**
 * EmptyState Molecule Types
 *
 * Props for the empty state component used when lists have no content.
 */

import type { ViewProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export interface EmptyStateProps extends Omit<ViewProps, 'style'> {
  /**
   * Icon to display at the top of the empty state
   */
  icon?: LucideIcon;

  /**
   * Main title text
   */
  title: string;

  /**
   * Subtitle or description text
   */
  subtitle?: string;
}
