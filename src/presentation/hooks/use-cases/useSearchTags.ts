/**
 * useSearchTags Hook
 *
 * Encapsulates the SearchTags use case with repository injection.
 */

import { useCallback } from 'react';

import type { Tag } from '@domain/inbox/entities';
import { SearchTags, type SearchTagsInput } from '@domain/inbox/use-cases/SearchTags';

import { useInboxRepository } from '../useInboxRepository';

export type SearchTagsFn = (input: SearchTagsInput) => Promise<Tag[]>;

/**
 * Hook that returns a function to search tags.
 * Encapsulates the repository injection.
 */
export function useSearchTags(): SearchTagsFn {
  const repository = useInboxRepository();

  return useCallback(
    (input: SearchTagsInput) => SearchTags(input, (params) => repository.searchTags(params)),
    [repository],
  );
}
