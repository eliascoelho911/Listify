/**
 * MediaCard Molecule Component
 *
 * Displays a movie, book, or game item with cover image, title, metadata, and checked state.
 * Used in interest lists (movies, books, games) to show media items.
 */

import React, { type ReactElement, useCallback } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Book, CheckCircle, Film, Gamepad2, Star } from 'lucide-react-native';

import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createMediaCardStyles } from './MediaCard.styles';
import type {
  MediaCardProps,
  MediaCardType,
  MediaItem,
  MediaTypeConfig,
} from './MediaCard.types';
import type { BookMetadata, GameMetadata, MovieMetadata } from '@domain/item';

const MEDIA_TYPE_CONFIG: Record<MediaCardType, MediaTypeConfig> = {
  movie: {
    icon: Film,
    label: 'Filme',
    checkedLabel: 'Assistido',
  },
  book: {
    icon: Book,
    label: 'Livro',
    checkedLabel: 'Lido',
  },
  game: {
    icon: Gamepad2,
    label: 'Jogo',
    checkedLabel: 'Jogado',
  },
};

function getMediaCardType(item: MediaItem): MediaCardType {
  return item.type;
}

export function MediaCard({
  item,
  onPress,
  onLongPress,
  onToggleChecked,
  disabled = false,
  showCheckbox = true,
  showRating = true,
  showYear = true,
  style,
  testID,
  ...viewProps
}: MediaCardProps): ReactElement {
  const { theme } = useTheme();
  const styles = createMediaCardStyles(theme);

  const mediaType = getMediaCardType(item);
  const config = MEDIA_TYPE_CONFIG[mediaType];
  const isChecked = item.isChecked ?? false;
  const metadata = item.metadata;
  const coverUrl = metadata?.coverUrl;
  const rating = metadata?.rating;
  const releaseDate = metadata?.releaseDate;
  const description = metadata?.description;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  // Extract type-specific metadata
  const authors =
    mediaType === 'book' ? (metadata as BookMetadata | undefined)?.authors : undefined;
  const cast = mediaType === 'movie' ? (metadata as MovieMetadata | undefined)?.cast : undefined;
  const developer =
    mediaType === 'game' ? (metadata as GameMetadata | undefined)?.developer : undefined;

  // Get secondary info based on media type
  const secondaryInfo =
    authors?.length
      ? authors.slice(0, 2).join(', ')
      : cast?.length
        ? cast.slice(0, 2).join(', ')
        : developer ?? null;

  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      onPress(item);
    }
  }, [disabled, item, onPress]);

  const handleLongPress = useCallback(() => {
    if (!disabled && onLongPress) {
      onLongPress(item);
    }
  }, [disabled, item, onLongPress]);

  const handleCheckboxToggle = useCallback(() => {
    if (!disabled && onToggleChecked) {
      onToggleChecked(item, !isChecked);
    }
  }, [disabled, isChecked, item, onToggleChecked]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
        isChecked && styles.containerChecked,
        disabled && styles.containerDisabled,
        style,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={disabled && !onToggleChecked}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}${isChecked ? `, ${config.checkedLabel}` : ''}`}
      accessibilityState={{ checked: isChecked, disabled }}
      testID={testID}
      {...viewProps}
    >
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={styles.coverImage} resizeMode="cover" />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Icon icon={config.icon} size="xl" color={theme.colors.mutedForeground} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, isChecked && styles.titleChecked]} numberOfLines={2}>
            {item.title}
          </Text>
        </View>

        <View style={styles.metadataRow}>
          {showYear && year && <Text style={styles.yearText}>{year}</Text>}
          {showRating && rating && rating > 0 && (
            <View style={styles.ratingBadge}>
              <Icon icon={Star} size="xs" color={theme.colors.warning} />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {secondaryInfo && (
          <Text style={styles.secondaryInfo} numberOfLines={1}>
            {secondaryInfo}
          </Text>
        )}

        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        {isChecked && (
          <View style={styles.statusBadge}>
            <Icon icon={CheckCircle} size="xs" color={theme.colors.accentForeground} />
            <Text style={styles.statusText}>{config.checkedLabel}</Text>
          </View>
        )}
      </View>

      {showCheckbox && onToggleChecked && (
        <View style={styles.checkboxContainer}>
          <Checkbox
            checked={isChecked}
            onCheckedChange={handleCheckboxToggle}
            disabled={disabled}
            size="md"
          />
        </View>
      )}
    </Pressable>
  );
}
