/**
 * CategorySelector Molecule Types
 *
 * A full-size category selector for list type selection in forms.
 * Shows all available list types with icons, labels, and descriptions.
 */

import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Available list types for selection (excludes 'notes' as it's a prefabricated list)
 */
export type SelectableListType = 'shopping' | 'movies' | 'books' | 'games';

export interface CategorySelectorProps {
  /**
   * Currently selected category type
   */
  selectedType: SelectableListType;

  /**
   * Callback when a category is selected
   */
  onSelect: (type: SelectableListType) => void;

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
