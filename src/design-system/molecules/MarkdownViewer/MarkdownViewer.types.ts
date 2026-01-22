/**
 * MarkdownViewer Molecule Types
 *
 * Component for rendering markdown content in read-only mode.
 * Supports common markdown syntax: headers, bold, italic, lists, links.
 */

import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

export interface MarkdownViewerProps extends Omit<ViewProps, 'style'> {
  /**
   * Markdown content to render
   */
  content: string;

  /**
   * Maximum number of lines to show (0 = unlimited)
   * @default 0
   */
  maxLines?: number;

  /**
   * Custom text style for the base text
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Callback when a link is pressed
   */
  onLinkPress?: (url: string) => void;
}
