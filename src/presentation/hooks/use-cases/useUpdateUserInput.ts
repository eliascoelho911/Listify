/**
 * useUpdateUserInput Hook
 *
 * Encapsulates the UpdateUserInput use case with repository injection.
 */

import { useCallback } from 'react';

import type { UserInput } from '@domain/inbox/entities';
import { UpdateUserInput } from '@domain/inbox/use-cases/UpdateUserInput';

import { useInboxRepository } from '../useInboxRepository';

export type UpdateUserInputFn = (id: string, text: string) => Promise<UserInput>;

/**
 * Hook that returns a function to update user inputs.
 * Encapsulates the repository injection.
 */
export function useUpdateUserInput(): UpdateUserInputFn {
  const repository = useInboxRepository();

  return useCallback(
    (id: string, text: string) => UpdateUserInput(repository, id, text),
    [repository],
  );
}
