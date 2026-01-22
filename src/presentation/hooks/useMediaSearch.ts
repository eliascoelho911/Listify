/**
 * useMediaSearch Hook
 *
 * Hook for searching media (movies, books, games) from external providers.
 * Provides debounced search, loading state, and error handling.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppDependencies } from '@app/di';
import type { MediaProviderRepository, MediaSearchResult } from '@domain/common';

const DEBOUNCE_MS = 300;

type MediaType = 'movie' | 'book' | 'game';

interface UseMediaSearchOptions {
  /**
   * Type of media to search
   */
  mediaType: MediaType;

  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceMs?: number;

  /**
   * Minimum query length before searching
   * @default 2
   */
  minQueryLength?: number;
}

interface UseMediaSearchResult {
  /**
   * Search query string
   */
  query: string;

  /**
   * Set the search query (triggers debounced search)
   */
  setQuery: (query: string) => void;

  /**
   * Search results from provider
   */
  results: MediaSearchResult[];

  /**
   * Whether a search is in progress
   */
  isLoading: boolean;

  /**
   * Error message if search failed
   */
  error: string | null;

  /**
   * Clear search results and query
   */
  clear: () => void;

  /**
   * Whether the provider is available
   */
  isAvailable: boolean;
}

/**
 * Hook for searching media with debouncing and error handling
 */
export function useMediaSearch(options: UseMediaSearchOptions): UseMediaSearchResult {
  const { mediaType, debounceMs = DEBOUNCE_MS, minQueryLength = 2 } = options;
  const { movieProvider } = useAppDependencies();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get the appropriate provider based on media type
  const provider: MediaProviderRepository | null = (() => {
    switch (mediaType) {
      case 'movie':
        return movieProvider;
      case 'book':
        // TODO: Add book provider when implemented
        return null;
      case 'game':
        // TODO: Add game provider when implemented
        return null;
      default:
        return null;
    }
  })();

  const isAvailable = provider !== null;

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!provider || searchQuery.length < minQueryLength) {
        setResults([]);
        setError(null);
        return;
      }

      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await provider.search(searchQuery);
        setResults(searchResults);
      } catch (err) {
        // Only set error if not aborted
        if (err instanceof Error && err.name !== 'AbortError') {
          console.debug('[useMediaSearch] Search error:', err);
          setError('Failed to search. Please try again.');
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [provider, minQueryLength],
  );

  // Handle query changes with debouncing
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If query is too short, clear results immediately
    if (query.length < minQueryLength) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Set loading state immediately for better UX
    setIsLoading(true);

    // Debounce the actual search
    debounceTimerRef.current = setTimeout(() => {
      performSearch(query);
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceMs, minQueryLength, performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clear,
    isAvailable,
  };
}
