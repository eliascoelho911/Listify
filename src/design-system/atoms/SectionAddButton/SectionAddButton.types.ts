/**
 * SectionAddButton Atom Types
 *
 * A small button for adding a new section to a list.
 */

import type { ViewProps } from 'react-native';

export interface SectionAddButtonProps extends Omit<ViewProps, 'style'> {
  /**
   * Callback when the button is pressed
   */
  onPress?: () => void;

  /**
   * Button label text
   * @default "Add Section"
   */
  label?: string;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;
}
