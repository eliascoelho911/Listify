/**
 * InfiniteScrollList Organism Component
 *
 * Generic virtualized list with infinite scroll support.
 * Uses SectionList internally for grouped data with sticky headers.
 */

import React, { type ReactElement, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  type SectionListData,
  type SectionListRenderItemInfo,
  View,
} from 'react-native';

import { GroupHeader } from '../../atoms/GroupHeader/GroupHeader';
import { useTheme } from '../../theme';
import { createInfiniteScrollListStyles } from './InfiniteScrollList.styles';
import type { InfiniteScrollGroup, InfiniteScrollListProps } from './InfiniteScrollList.types';

type SectionData<T> = SectionListData<T, InfiniteScrollGroup<T>>;

export function InfiniteScrollList<T>({
  groups,
  renderItem,
  renderGroupHeader,
  keyExtractor,
  isLoading = false,
  hasMore = false,
  onEndReached,
  onEndReachedThreshold = 0.5,
  onRefresh,
  refreshing = false,
  emptyContent,
  loadingFooter,
  style,
  contentContainerStyle,
  stickyHeaders = true,
  itemGap = 8,
  groupGap = 16,
}: InfiniteScrollListProps<T>): ReactElement {
  const { theme } = useTheme();
  const styles = createInfiniteScrollListStyles(theme, itemGap, groupGap);

  const sections: SectionData<T>[] = useMemo(() => {
    return groups.map((group) => ({
      ...group,
      data: group.items,
    }));
  }, [groups]);

  const handleRenderItem = useCallback(
    ({ item, index }: SectionListRenderItemInfo<T, InfiniteScrollGroup<T>>) => (
      <View style={styles.itemContainer}>{renderItem(item, index)}</View>
    ),
    [renderItem, styles.itemContainer],
  );

  const handleRenderSectionHeader = useCallback(
    ({ section }: { section: SectionData<T> }) => {
      if (renderGroupHeader) {
        return renderGroupHeader(section);
      }
      return <GroupHeader label={section.title} count={section.items.length} variant="date" />;
    },
    [renderGroupHeader],
  );

  const handleKeyExtractor = useCallback(
    (item: T, index: number) => keyExtractor(item) || String(index),
    [keyExtractor],
  );

  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore && onEndReached) {
      onEndReached();
    }
  }, [isLoading, hasMore, onEndReached]);

  const renderFooter = useCallback(() => {
    if (isLoading && hasMore) {
      return (
        <View style={styles.footerContainer}>
          {loadingFooter || (
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              style={styles.loadingIndicator}
            />
          )}
        </View>
      );
    }
    return null;
  }, [isLoading, hasMore, loadingFooter, styles, theme.colors.primary]);

  const renderEmpty = useCallback(() => {
    if (isLoading && groups.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }
    if (emptyContent) {
      return <View style={styles.emptyContainer}>{emptyContent}</View>;
    }
    return null;
  }, [isLoading, groups.length, emptyContent, styles, theme.colors.primary]);

  const refreshControl = useMemo(() => {
    if (!onRefresh) return undefined;
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={theme.colors.primary}
        colors={[theme.colors.primary]}
      />
    );
  }, [onRefresh, refreshing, theme.colors.primary]);

  return (
    <SectionList
      sections={sections}
      renderItem={handleRenderItem}
      renderSectionHeader={handleRenderSectionHeader}
      keyExtractor={handleKeyExtractor}
      onEndReached={handleEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshControl={refreshControl}
      stickySectionHeadersEnabled={stickyHeaders}
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    />
  );
}
