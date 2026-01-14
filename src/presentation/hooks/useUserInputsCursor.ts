/**
 * useUserInputsCursor Hook
 *
 * Simple cursor-based pagination hook without real-time reactivity.
 * Uses cursor pagination for stable and efficient data loading.
 * Re-fetches data via refetch() after mutations.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { useInboxRepository } from '@app/di/AppDependenciesProvider';
import { DEFAULT_PAGE_SIZE, INITIAL_PAGE_SIZE } from '@domain/inbox/constants';
import type { PaginationCursor, UserInput } from '@domain/inbox/entities';

export type UseUserInputsCursorResult = {
  /** List of user inputs */
  inputs: UserInput[];

  /** True while initial data is loading */
  isLoading: boolean;

  /** True while loading more items */
  isLoadingMore: boolean;

  /** True if there are more items to load */
  hasMore: boolean;

  /** Error from loading, if any */
  error: Error | null;

  /** Function to load more items */
  loadMore: () => Promise<void>;

  /** Function to refetch all data from the beginning */
  refetch: () => Promise<void>;
};

/**
 * Hook that provides cursor-based paginated user inputs.
 *
 * Uses createdAt + id as cursor for stable pagination.
 * Data is loaded on demand (no real-time reactivity).
 * Call refetch() after mutations to update the list.
 *
 * @returns Paginated inputs with loading states, loadMore and refetch functions
 */
export function useUserInputsCursor(): UseUserInputsCursorResult {
  const repository = useInboxRepository();

  const [inputs, setInputs] = useState<UserInput[]>([]);
  const [cursor, setCursor] = useState<PaginationCursor | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isInitialLoad = useRef(true);

  const fetchPage = useCallback(
    async (cursorParam: PaginationCursor | null, append: boolean): Promise<void> => {
      try {
        const result = await repository.getUserInputs({
          cursor: cursorParam ?? undefined,
          limit: isInitialLoad.current ? INITIAL_PAGE_SIZE : DEFAULT_PAGE_SIZE,
        });

        setInputs((prev) => (append ? [...prev, ...result.items] : result.items));
        setCursor(result.nextCursor);
        setHasMore(result.hasMore);
        setError(null);
        isInitialLoad.current = false;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load inputs'));
      }
    },
    [repository],
  );

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchPage(null, false).finally(() => setIsLoading(false));
  }, [fetchPage]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (!hasMore || isLoadingMore || isLoading) {
      return;
    }

    setIsLoadingMore(true);
    await fetchPage(cursor, true);
    setIsLoadingMore(false);
  }, [hasMore, isLoadingMore, isLoading, cursor, fetchPage]);

  const refetch = useCallback(async (): Promise<void> => {
    isInitialLoad.current = true;
    setIsLoading(true);
    setCursor(null);
    await fetchPage(null, false);
    setIsLoading(false);
  }, [fetchPage]);

  return {
    inputs,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refetch,
  };
}
