/**
 * SearchResultCard Molecule Component
 *
 * Displays a search result with icon, title (with optional highlighting), and subtitle.
 */

import React, { type ReactElement, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import {
  Book,
  ChevronRight,
  Film,
  Gamepad2,
  List,
  type LucideIcon,
  ShoppingCart,
  StickyNote,
} from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createSearchResultCardStyles } from './SearchResultCard.styles';
import type {
  HighlightSegment,
  SearchResultCardProps,
  SearchResultType,
} from './SearchResultCard.types';

const RESULT_TYPE_ICONS: Record<SearchResultType, LucideIcon> = {
  note: StickyNote,
  shopping: ShoppingCart,
  movie: Film,
  book: Book,
  game: Gamepad2,
  list: List,
};

function getHighlightedSegments(text: string, query: string): HighlightSegment[] {
  if (!query.trim()) {
    return [{ text, isHighlight: false }];
  }

  const segments: HighlightSegment[] = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let lastIndex = 0;

  let matchIndex = lowerText.indexOf(lowerQuery);
  while (matchIndex !== -1) {
    if (matchIndex > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, matchIndex),
        isHighlight: false,
      });
    }
    segments.push({
      text: text.slice(matchIndex, matchIndex + query.length),
      isHighlight: true,
    });
    lastIndex = matchIndex + query.length;
    matchIndex = lowerText.indexOf(lowerQuery, lastIndex);
  }

  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isHighlight: false,
    });
  }

  return segments;
}

export function SearchResultCard({
  title,
  subtitle,
  resultType,
  searchQuery,
  onPress,
  timestamp,
  style,
  testID,
}: SearchResultCardProps): ReactElement {
  const { theme } = useTheme();
  const styles = createSearchResultCardStyles(theme);

  const IconComponent = RESULT_TYPE_ICONS[resultType];

  const titleSegments = useMemo(
    () => getHighlightedSegments(title, searchQuery ?? ''),
    [title, searchQuery],
  );

  const formattedTimestamp = useMemo(() => {
    if (!timestamp) return null;
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return timestamp.toLocaleDateString();
  }, [timestamp]);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={onPress}
      accessibilityLabel={`${resultType} result: ${title}`}
      accessibilityRole="button"
      testID={testID}
    >
      <View style={styles.iconContainer}>
        <Icon icon={IconComponent} size="md" color={theme.colors.mutedForeground} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          {titleSegments.map((segment, index) => (
            <Text key={index} style={segment.isHighlight ? styles.highlightText : styles.titleText}>
              {segment.text}
            </Text>
          ))}
        </View>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        {formattedTimestamp && <Text style={styles.timestamp}>{formattedTimestamp}</Text>}
      </View>
      <View style={styles.chevron}>
        <Icon icon={ChevronRight} size="sm" color={theme.colors.mutedForeground} />
      </View>
    </Pressable>
  );
}
