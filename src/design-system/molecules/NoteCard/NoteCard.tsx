/**
 * NoteCard Molecule Component
 *
 * Specialized card for displaying note items in the Notes screen.
 * Shows title, description preview, and timestamp.
 */

import React, { type ReactElement, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { FileText } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createNoteCardStyles } from './NoteCard.styles';
import type { NoteCardProps } from './NoteCard.types';

function formatTimestamp(date: Date, locale: string): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}m`;
  }
  if (hours < 24) {
    return `${hours}h`;
  }
  if (days < 7) {
    return `${days}d`;
  }
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

function getDescriptionPreview(description: string | undefined): string | undefined {
  if (!description) return undefined;
  // Remove markdown formatting for preview
  const cleaned = description
    .replace(/[#*_~`]/g, '') // Remove markdown symbols
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  return cleaned.substring(0, 120);
}

export function NoteCard({
  note,
  onPress,
  onLongPress,
  selected = false,
  style,
  ...viewProps
}: NoteCardProps): ReactElement {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const styles = createNoteCardStyles(theme, selected);

  const handlePress = useCallback(() => {
    onPress?.(note);
  }, [note, onPress]);

  const handleLongPress = useCallback(() => {
    onLongPress?.(note);
  }, [note, onLongPress]);

  const descriptionPreview = useMemo(
    () => getDescriptionPreview(note.description),
    [note.description],
  );
  const charCount = note.description?.length ?? 0;

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      accessibilityRole="button"
      accessibilityLabel={`Note: ${note.title}`}
      {...viewProps}
    >
      <View style={styles.iconContainer}>
        <Icon icon={FileText} size="md" color={theme.colors.itemNote} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>
          <Text style={styles.timestamp}>{formatTimestamp(note.createdAt, i18n.language)}</Text>
        </View>

        {descriptionPreview && (
          <Text style={styles.description} numberOfLines={2}>
            {descriptionPreview}
          </Text>
        )}

        {charCount > 0 && (
          <View style={styles.metaRow}>
            <Text style={styles.charCount}>
              {t('notes.characterCount', {
                count: charCount,
                defaultValue: '{{count}} caracteres',
              })}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
