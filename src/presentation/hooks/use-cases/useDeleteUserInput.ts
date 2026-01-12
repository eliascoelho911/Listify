/**
 * useDeleteUserInput Hook
 *
 * Encapsulates the DeleteUserInput use case with repository injection.
 */

import { useCallback } from 'react';

import { DeleteUserInput } from '@domain/inbox/use-cases/DeleteUserInput';

import { useInboxRepository } from '../useInboxRepository';

export type DeleteUserInputFn = (id: string) => Promise<void>;

/**
 * Hook that returns a function to delete user inputs.
 * Encapsulates the repository injection.
 */
export function useDeleteUserInput(): DeleteUserInputFn {
  const repository = useInboxRepository();

  return useCallback((id: string) => DeleteUserInput(repository, id), [repository]);
}
