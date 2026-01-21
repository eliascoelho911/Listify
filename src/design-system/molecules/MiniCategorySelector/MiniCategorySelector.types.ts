/**
 * MiniCategorySelector Molecule Types
 *
 * A compact category selector for list type selection during list creation.
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

/**
 * Available list types for selection (excludes 'notes' as it's a prefabricated list)
 */
export type SelectableListType = 'shopping' | 'movies' | 'books' | 'games';

/**
 * Category option configuration
 */
export interface CategoryOption {
  /**
   * List type identifier
   */
  type: SelectableListType;

  /**
   * Display label for the category
   */
  label: string;

  /**
   * Whether this option is currently selected
   */
  selected?: boolean;
}

export interface MiniCategorySelectorProps extends Omit<ViewProps, 'style'> {
  /**
   * Currently selected category type
   */
  selectedType?: SelectableListType;

  /**
   * Callback when a category is selected
   */
  onSelect: (type: SelectableListType) => void;

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Whether to show the category labels
   * @default true
   */
  showLabels?: boolean;

  /**
   * Optional inferred type to highlight as suggestion
   */
  inferredType?: SelectableListType;
}
