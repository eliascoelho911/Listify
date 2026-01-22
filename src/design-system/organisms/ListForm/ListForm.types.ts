/**
 * ListForm Organism Types
 *
 * A form for creating or editing lists with name input and category selection.
 */

import type { StyleProp, ViewStyle } from 'react-native';

import type { SelectableListType } from '../../molecules/CategorySelector/CategorySelector.types';

export type { SelectableListType };

export interface ListFormData {
  /**
   * Name of the list
   */
  name: string;

  /**
   * Type of the list
   */
  listType: SelectableListType;

  /**
   * Optional description
   */
  description?: string;
}

export interface ListFormProps {
  /**
   * Initial form data (for editing)
   */
  initialData?: Partial<ListFormData>;

  /**
   * Callback when form is submitted
   */
  onSubmit: (data: ListFormData) => void;

  /**
   * Callback when form is cancelled
   */
  onCancel: () => void;

  /**
   * Whether the form is in a loading state
   */
  isLoading?: boolean;

  /**
   * Error message to display (e.g., duplicate name)
   */
  error?: string | null;

  /**
   * Whether this is editing an existing list (shows different button label)
   */
  isEditing?: boolean;

  /**
   * Whether to disable the type/category selection (for editing existing lists)
   * @default false
   */
  disableTypeSelection?: boolean;

  /**
   * Optional style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
