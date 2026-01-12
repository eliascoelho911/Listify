/**
 * SearchTags Use Case
 *
 * Searches for tags by prefix (autocomplete).
 * Returns tags sorted by usage count (most used first).
 */

import type { Tag } from '../entities';
import type { SearchTagsParams } from '../ports/InboxRepository';

const DEFAULT_LIMIT = 5;

export interface SearchTagsInput {
  query: string;
  limit?: number;
}

export type SearchTagsFunction = (params: SearchTagsParams) => Promise<Tag[]>;

/**
 * Searches for tags matching a prefix.
 *
 * @param input - Query string and optional limit
 * @param searchTags - Repository function to search tags
 * @returns Array of matching tags sorted by usage count
 */
export async function SearchTags(
  input: SearchTagsInput,
  searchTags: SearchTagsFunction,
): Promise<Tag[]> {
  const { query, limit = DEFAULT_LIMIT } = input;

  return searchTags({ query, limit });
}
