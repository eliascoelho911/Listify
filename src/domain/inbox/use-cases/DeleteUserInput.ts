/**
 * DeleteUserInput Use Case
 *
 * Deletes a user input by ID.
 */

import type { InboxRepository } from '../ports/InboxRepository';
import { UserInputNotFoundError } from './errors';

/**
 * Deletes a user input.
 *
 * @param repository - The inbox repository
 * @param id - The ID of the input to delete
 * @throws UserInputNotFoundError if input does not exist
 */
export async function DeleteUserInput(repository: InboxRepository, id: string): Promise<void> {
  const existingInput = await repository.getUserInputById(id);
  if (!existingInput) {
    throw new UserInputNotFoundError(id);
  }

  await repository.deleteUserInput(id);
}
