/**
 * MarkdownEditor Molecule Types
 *
 * Component for editing markdown content with optional toolbar.
 * Provides basic formatting helpers for common markdown syntax.
 */

import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

export interface MarkdownEditorProps extends Omit<ViewProps, 'style'> {
  /**
   * Current markdown content value
   */
  value: string;

  /**
   * Callback when content changes
   */
  onChangeText: (text: string) => void;

  /**
   * Placeholder text when editor is empty
   */
  placeholder?: string;

  /**
   * Whether the editor is editable
   * @default true
   */
  editable?: boolean;

  /**
   * Whether to auto-focus the editor on mount
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Minimum height of the editor
   * @default 200
   */
  minHeight?: number;

  /**
   * Whether to show the formatting toolbar
   * @default true
   */
  showToolbar?: boolean;

  /**
   * Custom style for the text input
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Callback when editor loses focus
   */
  onBlur?: () => void;

  /**
   * Callback when editor gains focus
   */
  onFocus?: () => void;
}

export type MarkdownFormatAction =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'code'
  | 'link'
  | 'list'
  | 'heading';
