/**
 * UpdateUserInput Use Case
 *
 * Updates an existing user input's text.
 */

import type { UserInput } from '../entities/UserInput';
import type { InboxRepository } from '../ports/InboxRepository';
import { EmptyTextError, UserInputNotFoundError } from './errors';

/**
 * Updates an existing user input.
 *
 * @param repository - The inbox repository
 * @param id - The ID of the input to update
 * @param text - The new text for the input
 * @returns The updated user input
 * @throws EmptyTextError if text is empty or whitespace
 * @throws UserInputNotFoundError if input does not exist
 */
export async function UpdateUserInput(
  repository: InboxRepository,
  id: string,
  text: string,
): Promise<UserInput> {
  const trimmedText = text.trim();

  if (trimmedText.length === 0) {
    throw new EmptyTextError();
  }

  const existingInput = await repository.getUserInputById(id);
  if (!existingInput) {
    throw new UserInputNotFoundError(id);
  }

  return repository.updateUserInput({
    id,
    text: trimmedText,
  });
}
