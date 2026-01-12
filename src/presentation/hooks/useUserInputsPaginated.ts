/**
 * useUserInputsPaginated Hook
 *
 * Hybrid pagination hook that combines reactive live data for the initial window
 * with on-demand loading for older items.
 *
 * Strategy:
 * - First 50 items: Reactive via useLiveQuery (auto-updates on DB changes)
 * - Older items: Loaded on demand via repository.getUserInputs()
 * - Merge: Deduplicates and combines both sources
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_PAGE_SIZE, INITIAL_PAGE_SIZE } from '@domain/inbox/constants';
import type { UserInput } from '@domain/inbox/entities';

import { useInboxRepository } from './useInboxRepository';
import { useUserInputsLive } from './useUserInputsLive';

export type UseUserInputsPaginatedResult = {
  /** Combined list of user inputs (live + older) */
  inputs: UserInput[];

  /** True while initial live data is loading */
  isLoading: boolean;

  /** True while loading more older items */
  isLoadingMore: boolean;

  /** True if there are more items to load */
  hasMore: boolean;

  /** Function to load more older items */
  loadMore: () => Promise<void>;

  /** Error from live query or loadMore, if any */
  error: Error | null;
};

/**
 * Hook that provides paginated user inputs with hybrid reactivity.
 *
 * The first INITIAL_PAGE_SIZE items are reactive (auto-update on DB changes).
 * Older items are loaded on demand and merged with deduplication.
 *
 * @returns Paginated inputs with loading states and loadMore function
 */
export function useUserInputsPaginated(): UseUserInputsPaginatedResult {
  const repository = useInboxRepository();

  // Reactive data for the first window (INITIAL_PAGE_SIZE items)
  const { inputs: liveInputs, isLoading, error: liveError } = useUserInputsLive(INITIAL_PAGE_SIZE);

  // State for older items loaded on demand
  const [olderInputs, setOlderInputs] = useState<UserInput[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  // Update hasMore based on initial live data count
  useEffect(() => {
    if (!isLoading) {
      setHasMore(liveInputs.length >= INITIAL_PAGE_SIZE);
    }
  }, [liveInputs.length, isLoading]);

  // Merge live and older inputs with deduplication
  const inputs = useMemo((): UserInput[] => {
    if (olderInputs.length === 0) {
      return liveInputs;
    }

    // Create a Set of live input IDs for fast lookup
    const liveIds = new Set(liveInputs.map((input) => input.id));

    // Filter out older inputs that also appear in live (deduplicate)
    const uniqueOlder = olderInputs.filter((input) => !liveIds.has(input.id));

    // Return live first, then older (maintains chronological order)
    return [...liveInputs, ...uniqueOlder];
  }, [liveInputs, olderInputs]);

  // Load more older items
  const loadMore = useCallback(async (): Promise<void> => {
    if (!hasMore || isLoadingMore || isLoading) {
      return;
    }

    setIsLoadingMore(true);
    setLoadError(null);

    try {
      const result = await repository.getUserInputs({
        page,
        limit: DEFAULT_PAGE_SIZE,
      });

      setOlderInputs((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      setLoadError(err instanceof Error ? err : new Error('Failed to load more inputs'));
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, isLoading, repository, page]);

  // Combine errors (prioritize live error as it's more critical)
  const error = liveError ?? loadError;

  return {
    inputs,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
  };
}
