/**
 * useCreateUserInput Hook
 *
 * Encapsulates the createUserInput use case with repository injection.
 */

import { useCallback } from 'react';

import type { UserInput } from '@domain/inbox/entities';
import {
  createUserInput,
  type CreateUserInputInput,
} from '@domain/inbox/use-cases/CreateUserInput';

import { useInboxRepository } from '../useInboxRepository';

export type CreateUserInputFn = (input: CreateUserInputInput) => Promise<UserInput>;

/**
 * Hook that returns a function to create user inputs.
 * Encapsulates the repository injection.
 */
export function useCreateUserInput(): CreateUserInputFn {
  const repository = useInboxRepository();

  return useCallback(
    (input: CreateUserInputInput) => createUserInput(input, { repository }),
    [repository],
  );
}
