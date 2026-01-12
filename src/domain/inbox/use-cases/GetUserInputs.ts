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
 * @param page - Page number (0-indexed, default: 0)
 * @param limit - Number of items to fetch (default: DEFAULT_PAGE_SIZE)
 * @returns Paginated result with items, total count, and pagination info
 */
export async function GetUserInputs(
  repository: InboxRepository,
  page: number = 0,
  limit: number = DEFAULT_PAGE_SIZE,
): Promise<PaginatedUserInputs> {
  return repository.getUserInputs({ page, limit });
}
