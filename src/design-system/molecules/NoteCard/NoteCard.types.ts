/**
 * NoteCard Molecule Types
 *
 * Specialized card for displaying note items in the Notes screen.
 * Shows title, description preview, and timestamp.
 */

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import type { NoteItem } from '@domain/item/entities/item.entity';

export interface NoteCardProps extends Omit<ViewProps, 'style'> {
  /**
   * The note item to display
   */
  note: NoteItem;

  /**
   * Callback when note card is pressed
   */
  onPress?: (note: NoteItem) => void;

  /**
   * Callback when long press is triggered (for context menu)
   */
  onLongPress?: (note: NoteItem) => void;

  /**
   * Whether the note card is currently selected
   */
  selected?: boolean;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;
}
