/**
 * SearchBar Molecule Types
 */

import type { InputProps } from '../../atoms/Input/Input.types';

export interface SearchBarProps extends Omit<InputProps, 'state'> {
  /**
   * Callback when search is triggered
   */
  onSearch?: (value: string) => void;

  /**
   * Callback when clear button is pressed
   */
  onClear?: () => void;

  /**
   * Whether to show clear button
   */
  showClear?: boolean;
}
