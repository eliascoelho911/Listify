/**
 * GetUserInputs Use Case
 *
 * Retrieves paginated user inputs from the repository.
 */

import { DEFAULT_PAGE_SIZE } from '../constants';
import type { PaginatedUserInputs } from '../entities/types';
import type { InboxRepository } from '../ports/InboxRepository';

/**
 * Gets paginated user inputs.
 *
 * @param repository - The inbox repository
 * @param offset - Starting position (default: 0)
 * @param limit - Number of items to fetch (default: DEFAULT_PAGE_SIZE)
 * @returns Paginated result with items, total count, and pagination info
 */
export async function GetUserInputs(
  repository: InboxRepository,
  offset: number = 0,
  limit: number = DEFAULT_PAGE_SIZE,
): Promise<PaginatedUserInputs> {
  const [items, total] = await Promise.all([
    repository.getAll(offset, limit),
    repository.countInputs(),
  ]);

  const hasMore = offset + items.length < total;

  return {
    items,
    total,
    offset,
    limit,
    hasMore,
  };
}
