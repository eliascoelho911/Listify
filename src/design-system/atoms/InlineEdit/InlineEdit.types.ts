/**
 * InlineEdit Atom Types
 *
 * Component for inline editing of text values.
 * Displays text normally and switches to an input on interaction.
 */

import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

export interface InlineEditProps extends Omit<ViewProps, 'style'> {
  /**
   * Current value to display/edit
   */
  value: string;

  /**
   * Callback when value changes
   */
  onChangeText: (text: string) => void;

  /**
   * Callback when editing is completed (blur or submit)
   */
  onSubmit?: (value: string) => void;

  /**
   * Placeholder text when value is empty
   */
  placeholder?: string;

  /**
   * Whether the component is in edit mode
   * @default false
   */
  isEditing?: boolean;

  /**
   * Callback when edit mode changes
   */
  onEditingChange?: (isEditing: boolean) => void;

  /**
   * Text variant to use for display mode
   * @default 'default'
   */
  variant?: 'title' | 'subtitle' | 'default';

  /**
   * Maximum number of characters allowed
   */
  maxLength?: number;

  /**
   * Whether to allow multiline editing
   * @default false
   */
  multiline?: boolean;

  /**
   * Custom style for the text/input
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Whether editing is disabled
   * @default false
   */
  disabled?: boolean;
}
