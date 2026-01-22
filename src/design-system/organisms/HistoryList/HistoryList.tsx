/**
 * HistoryList Organism Component
 *
 * List of purchase history entries.
 * Displays multiple HistoryCard components with empty state.
 */

import React, { type ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { History } from 'lucide-react-native';

import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { HistoryCard } from '../../molecules/HistoryCard/HistoryCard';
import { useTheme } from '../../theme';
import { createHistoryListStyles } from './HistoryList.styles';
import type { HistoryEntry, HistoryListProps } from './HistoryList.types';

export function HistoryList({
  entries,
  onEntryPress,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  style,
  testID,
}: HistoryListProps): ReactElement {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createHistoryListStyles(theme);

  const handleEntryPress = useCallback(
    (entry: HistoryEntry) => {
      onEntryPress?.(entry);
    },
    [onEntryPress],
  );

  const renderItem = useCallback(
    ({ item }: { item: HistoryEntry }) => (
      <HistoryCard
        purchaseDate={item.purchaseDate}
        totalValue={item.totalValue}
        itemCount={item.itemCount}
        onPress={onEntryPress ? () => handleEntryPress(item) : undefined}
        testID={`${testID}-card-${item.id}`}
      />
    ),
    [handleEntryPress, onEntryPress, testID],
  );

  const keyExtractor = useCallback((item: HistoryEntry) => item.id, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, style]} testID={testID}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, style]} testID={testID}>
        <EmptyState
          icon={History}
          title={emptyTitle ?? t('history.empty.title', 'Nenhum histórico')}
          subtitle={
            emptyDescription ??
            t('history.empty.description', 'Suas compras concluídas aparecerão aqui')
          }
        />
      </View>
    );
  }

  return (
    <FlatList
      data={entries}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContent}
      style={[styles.container, style]}
      testID={testID}
    />
  );
}
