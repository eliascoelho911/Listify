/**
 * useUserInputsLive Hook
 *
 * Reactive hook for user inputs that uses the InboxRepository subscription.
 * Decoupled from Drizzle ORM - the reactivity comes from the repository.
 */

import { useCallback, useEffect, useState } from 'react';

import { useInboxRepository } from '@app/di/AppDependenciesProvider';
import type { UserInput } from '@domain/inbox/entities';

export type UseUserInputsLiveResult = {
  /** List of user inputs with their tags, sorted by updatedAt descending */
  inputs: UserInput[];
  /** True while initial data is loading */
  isLoading: boolean;
  /** Error from the query, if any */
  error: Error | null;
  /** Timestamp of the last update from the database */
  updatedAt: Date | undefined;
};

/**
 * Reactive hook that returns user inputs with their tags.
 *
 * Uses the InboxRepository.subscribeToInputs method to receive
 * updates when data changes. Decoupled from Drizzle ORM.
 *
 * @param limit - Optional limit for the number of inputs to fetch
 * @returns Live user inputs data with loading and error states
 */
export function useUserInputsLive(limit?: number): UseUserInputsLiveResult {
  const repository = useInboxRepository();

  const [inputs, setInputs] = useState<UserInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | undefined>(undefined);

  const handleInputsUpdate = useCallback((newInputs: UserInput[]) => {
    setInputs(newInputs);
    setIsLoading(false);
    setUpdatedAt(new Date());
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      const unsubscribe = repository.subscribeToInputs(handleInputsUpdate, {
        limit,
      });

      return () => {
        unsubscribe();
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to subscribe to inputs'));
      setIsLoading(false);
      return undefined;
    }
  }, [repository, limit, handleInputsUpdate]);

  return {
    inputs,
    isLoading,
    error,
    updatedAt,
  };
}
