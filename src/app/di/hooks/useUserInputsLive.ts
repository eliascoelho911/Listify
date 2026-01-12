/**
 * Reactive hook for user inputs - encapsulates Drizzle useLiveQuery.
 *
 * This hook lives in the DI layer because:
 * 1. It needs access to DrizzleDB (infrastructure detail)
 * 2. useLiveQuery must be called within React component tree
 * 3. Keeps presentation layer decoupled from ORM
 */
import { useMemo } from 'react';
import { desc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import type { UserInput } from '@domain/inbox/entities';
import { userInputs } from '@infra/drizzle/schema';

import { useAppDependencies } from '../AppDependenciesProvider';

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
 * This hook uses Drizzle's useLiveQuery to automatically re-render
 * when the database changes. No manual refresh needed.
 *
 * @param limit - Optional limit for the number of inputs to fetch
 * @returns Live user inputs data with loading and error states
 */
export function useUserInputsLive(limit?: number): UseUserInputsLiveResult {
  const { drizzleDb } = useAppDependencies();

  const {
    data: rawInputs,
    error,
    updatedAt,
  } = useLiveQuery(
    drizzleDb.query.userInputs.findMany({
      with: {
        inputTags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: [desc(userInputs.updatedAt)],
      ...(limit !== undefined ? { limit } : {}),
    }),
  );

  const inputs = useMemo((): UserInput[] => {
    if (!rawInputs) return [];

    return rawInputs.map((raw) => ({
      id: raw.id,
      text: raw.text,
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
      tags: raw.inputTags.map((it) => ({
        id: it.tag.id,
        name: it.tag.name,
        usageCount: it.tag.usageCount,
        createdAt: new Date(it.tag.createdAt),
      })),
    }));
  }, [rawInputs]);

  return {
    inputs,
    isLoading: rawInputs === undefined && !error,
    error: error ?? null,
    updatedAt,
  };
}
