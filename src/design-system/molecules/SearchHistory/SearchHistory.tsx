/**
 * SearchHistory Molecule Component
 *
 * Displays a list of recent search queries with delete and clear functionality.
 */

import React, { type ReactElement, useCallback } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Clock, X } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createSearchHistoryStyles } from './SearchHistory.styles';
import type { SearchHistoryItem, SearchHistoryProps } from './SearchHistory.types';

export function SearchHistory({
  entries,
  onSelectEntry,
  onDeleteEntry,
  onClearAll,
  title = 'Recent Searches',
  style,
  testID,
}: SearchHistoryProps): ReactElement {
  const { theme } = useTheme();
  const styles = createSearchHistoryStyles(theme);

  const renderEntry = useCallback(
    ({ item }: { item: SearchHistoryItem }) => (
      <Pressable
        style={styles.entryItem}
        onPress={() => onSelectEntry(item.query)}
        accessibilityLabel={`Search for ${item.query}`}
        accessibilityRole="button"
        testID={testID ? `${testID}-entry-${item.id}` : undefined}
      >
        <Icon icon={Clock} size="sm" color={theme.colors.mutedForeground} />
        <Text style={styles.entryText} numberOfLines={1}>
          {item.query}
        </Text>
        {onDeleteEntry && (
          <Pressable
            style={styles.deleteButton}
            onPress={() => onDeleteEntry(item.id)}
            hitSlop={8}
            accessibilityLabel={`Remove ${item.query} from history`}
            accessibilityRole="button"
            testID={testID ? `${testID}-delete-${item.id}` : undefined}
          >
            <Icon icon={X} size="sm" color={theme.colors.mutedForeground} />
          </Pressable>
        )}
      </Pressable>
    ),
    [onSelectEntry, onDeleteEntry, styles, theme.colors.mutedForeground, testID],
  );

  const keyExtractor = useCallback((item: SearchHistoryItem) => item.id, []);

  if (entries.length === 0) {
    return (
      <View style={[styles.container, style]} testID={testID}>
        <Text style={styles.emptyText}>No recent searches</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onClearAll && (
          <Pressable
            style={styles.clearButton}
            onPress={onClearAll}
            accessibilityLabel="Clear all search history"
            accessibilityRole="button"
            testID={testID ? `${testID}-clear-all` : undefined}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </Pressable>
        )}
      </View>
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
      />
    </View>
  );
}
