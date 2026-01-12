import { MAX_TEXT_LENGTH } from '../constants';
import type { UserInput } from '../entities';
import type { InboxRepository } from '../ports/InboxRepository';
import { EmptyTextError, TextTooLongError } from './errors';

export type CreateUserInputInput = {
  /** Texto do input (pode conter #tags) */
  text: string;
};

export type CreateUserInputDeps = {
  repository: InboxRepository;
};

/**
 * Creates a new UserInput in the system.
 *
 * Responsibilities:
 * 1. Validate text (not empty, max 5000 chars)
 * 2. Extract tags from text (#tag)
 * 3. Normalize tags (lowercase, no duplicates)
 * 4. Create/update tags in database
 * 5. Persist UserInput with relations
 *
 * @param input - Text of the input
 * @param deps - Repository
 * @returns Created UserInput
 * @throws EmptyTextError if text is empty/whitespace
 * @throws TextTooLongError if > 5000 chars
 */
export async function createUserInput(
  input: CreateUserInputInput,
  deps: CreateUserInputDeps,
): Promise<UserInput> {
  const trimmedText = input.text.trim();

  if (trimmedText.length === 0) {
    throw new EmptyTextError();
  }

  if (trimmedText.length > MAX_TEXT_LENGTH) {
    throw new TextTooLongError(MAX_TEXT_LENGTH);
  }

  return deps.repository.createUserInput({ text: trimmedText });
}
