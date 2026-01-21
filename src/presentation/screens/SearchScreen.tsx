/**
 * SearchScreen Presentation Component
 *
 * Global search screen with history, filters, and real-time results.
 * Implements debounced search with highlighting of matches.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type Href, useRouter } from 'expo-router';
import { Search, Settings } from 'lucide-react-native';

import type { Item } from '@domain/item';
import type { List } from '@domain/list';
import type { GlobalSearchTarget } from '@domain/search';
import { useSearchStoreWithDI } from '@presentation/hooks';
import type { SearchResult } from '@presentation/stores';
import { FilterChip } from '@design-system/atoms/FilterChip/FilterChip';
import { EmptyState } from '@design-system/molecules';
import { SearchHistory } from '@design-system/molecules/SearchHistory/SearchHistory';
import type { SearchHistoryItem } from '@design-system/molecules/SearchHistory/SearchHistory.types';
import { SearchInput } from '@design-system/molecules/SearchInput/SearchInput';
import { SearchResultCard } from '@design-system/molecules/SearchResultCard/SearchResultCard';
import type { SearchResultType } from '@design-system/molecules/SearchResultCard/SearchResultCard.types';
import { Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

const DEBOUNCE_DELAY = 300;

const TARGET_FILTER_KEYS: GlobalSearchTarget[] = ['all', 'items', 'lists'];

function mapResultType(result: SearchResult): SearchResultType {
  if (result.entityType === 'list') {
    return 'list';
  }
  return result.resultType as SearchResultType;
}

export function SearchScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const styles = createStyles(theme, insets.top);

  const searchStore = useSearchStoreWithDI();
  const {
    query,
    results,
    isSearching,
    history,
    historyLoaded,
    filters,
    setQuery,
    executeSearch,
    clearSearch,
    setFilters,
    loadHistory,
    addToHistory,
    deleteHistoryEntry,
    clearHistory,
  } = searchStore();

  const [localQuery, setLocalQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load history on mount
  useEffect(() => {
    if (!historyLoaded) {
      loadHistory();
    }
  }, [historyLoaded, loadHistory]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (localQuery.trim()) {
      debounceRef.current = setTimeout(() => {
        setQuery(localQuery);
        executeSearch();
      }, DEBOUNCE_DELAY);
    } else {
      setQuery('');
      clearSearch();
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [localQuery, setQuery, executeSearch, clearSearch]);

  const handleQueryChange = useCallback((text: string) => {
    setLocalQuery(text);
  }, []);

  const handleClear = useCallback(() => {
    setLocalQuery('');
    clearSearch();
  }, [clearSearch]);

  const handleSubmit = useCallback(async () => {
    const trimmedQuery = localQuery.trim();
    if (trimmedQuery) {
      try {
        await addToHistory(trimmedQuery);
        await executeSearch();
      } catch (error) {
        console.debug('[SearchScreen] Search failed:', error);
      }
    }
  }, [localQuery, addToHistory, executeSearch]);

  const handleSelectHistory = useCallback((historyQuery: string) => {
    setLocalQuery(historyQuery);
  }, []);

  const handleDeleteHistory = useCallback(
    (id: string) => {
      deleteHistoryEntry(id);
    },
    [deleteHistoryEntry],
  );

  const handleClearHistory = useCallback(() => {
    clearHistory();
  }, [clearHistory]);

  const handleFilterChange = useCallback(
    (target: GlobalSearchTarget) => {
      setFilters({ target });
      if (localQuery.trim()) {
        executeSearch();
      }
    },
    [setFilters, executeSearch, localQuery],
  );

  const handleResultPress = useCallback(
    (result: SearchResult) => {
      if (result.entityType === 'list') {
        // TODO: Route /list/[id] will be implemented in a future US
        router.push(`/list/${result.id}` as Href);
      } else {
        const item = result.entity as Item;
        if (item.listId) {
          // TODO: Route /list/[id] will be implemented in a future US
          router.push(`/list/${item.listId}?itemId=${item.id}` as Href);
        } else {
          // Inbox item - navigate to inbox with item highlighted
          router.push(`/?itemId=${item.id}` as Href);
        }
      }
    },
    [router],
  );

  const handleSettingsPress = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const historyItems: SearchHistoryItem[] = useMemo(
    () =>
      history.map((entry) => ({
        id: entry.id,
        query: entry.query,
        searchedAt: entry.searchedAt,
      })),
    [history],
  );

  const renderResult = useCallback(
    ({ item }: { item: SearchResult }) => {
      const list = item.entityType === 'list' ? (item.entity as List) : null;
      const itemEntity = item.entityType === 'item' ? (item.entity as Item) : null;

      let subtitle = item.subtitle;
      if (item.entityType === 'list' && list) {
        subtitle = t('search.listItems', { count: 0 });
      } else if (itemEntity && !itemEntity.listId) {
        subtitle = t('search.inbox', 'Inbox');
      }

      return (
        <SearchResultCard
          title={item.title}
          subtitle={subtitle}
          resultType={mapResultType(item)}
          searchQuery={query}
          onPress={() => handleResultPress(item)}
          timestamp={item.timestamp}
          style={styles.resultCard}
          testID={`search-result-${item.id}`}
        />
      );
    },
    [query, handleResultPress, styles.resultCard, t],
  );

  const keyExtractor = useCallback((item: SearchResult) => item.id, []);

  const showHistory = !localQuery.trim() && history.length > 0;
  const showResults = localQuery.trim().length > 0;
  const showEmptyResults = showResults && results.length === 0 && !isSearching;

  return (
    <View style={styles.container}>
      <Navbar
        title={t('search.title', 'Search')}
        rightActions={[
          {
            icon: Settings,
            onPress: handleSettingsPress,
            label: t('settings.title', 'Settings'),
          },
        ]}
      />

      <View style={styles.searchContainer}>
        <SearchInput
          value={localQuery}
          onChangeText={handleQueryChange}
          onSubmit={handleSubmit}
          onClear={handleClear}
          placeholder={t('search.placeholder', 'Search items and lists...')}
          autoFocus
          testID="search-input"
        />

        <View style={styles.filtersContainer}>
          {TARGET_FILTER_KEYS.map((filterKey) => (
            <FilterChip
              key={filterKey}
              label={t(`search.filter.${filterKey}`)}
              selected={filters.target === filterKey}
              onPress={() => handleFilterChange(filterKey)}
              testID={`filter-${filterKey}`}
            />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {showHistory && (
          <SearchHistory
            entries={historyItems}
            onSelectEntry={handleSelectHistory}
            onDeleteEntry={handleDeleteHistory}
            onClearAll={handleClearHistory}
            title={t('search.recentSearches', 'Recent Searches')}
            testID="search-history"
          />
        )}

        {showEmptyResults && (
          <EmptyState
            icon={Search}
            title={t('search.noResults', 'No results found')}
            subtitle={t('search.tryDifferent', 'Try a different search term')}
          />
        )}

        {showResults && results.length > 0 && (
          <FlatList
            data={results}
            renderItem={renderResult}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
            testID="search-results"
          />
        )}
      </View>
    </View>
  );
}

const createStyles = (
  theme: {
    colors: { background: string };
    spacing: { sm: number; md: number; lg: number };
  },
  topInset: number,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: topInset,
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    filtersContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    resultsList: {
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    resultCard: {
      marginBottom: theme.spacing.sm,
    },
  });
