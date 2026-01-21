/**
 * useInfiniteScroll Hook
 *
 * Manages paginated data loading with infinite scroll support.
 * Provides loading states, pagination logic, and refresh functionality.
 */

import { useCallback, useState } from 'react';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface UseInfiniteScrollOptions<T> {
  /**
   * Function to fetch a page of data
   */
  fetchPage: (offset: number, limit: number) => Promise<PaginatedResult<T>>;

  /**
   * Number of items per page
   * @default 20
   */
  pageSize?: number;
}

export interface UseInfiniteScrollReturn<T> {
  /**
   * All loaded items
   */
  items: T[];

  /**
   * Whether currently loading
   */
  isLoading: boolean;

  /**
   * Whether there's more data to load
   */
  hasMore: boolean;

  /**
   * Load more items (call on end reached)
   */
  loadMore: () => Promise<void>;

  /**
   * Refresh and reload from beginning
   */
  refresh: () => Promise<void>;

  /**
   * Whether currently refreshing
   */
  refreshing: boolean;

  /**
   * Total number of items (from server)
   */
  total: number;

  /**
   * Reset all state
   */
  reset: () => void;
}

export function useInfiniteScroll<T>({
  fetchPage,
  pageSize = 20,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const result = await fetchPage(offset, pageSize);
      setItems((prev) => [...prev, ...result.data]);
      setTotal(result.total);
      setOffset((prev) => prev + result.data.length);
      setHasMore(offset + result.data.length < result.total);
    } catch (error) {
      console.debug('[useInfiniteScroll] Error loading more:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPage, offset, pageSize, isLoading, hasMore]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const result = await fetchPage(0, pageSize);
      setItems(result.data);
      setTotal(result.total);
      setOffset(result.data.length);
      setHasMore(result.data.length < result.total);
    } catch (error) {
      console.debug('[useInfiniteScroll] Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchPage, pageSize]);

  const reset = useCallback(() => {
    setItems([]);
    setIsLoading(false);
    setRefreshing(false);
    setHasMore(true);
    setOffset(0);
    setTotal(0);
  }, []);

  return {
    items,
    isLoading,
    hasMore,
    loadMore,
    refresh,
    refreshing,
    total,
    reset,
  };
}
