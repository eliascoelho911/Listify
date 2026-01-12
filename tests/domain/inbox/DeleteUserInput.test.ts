/**
 * DeleteUserInput Use Case Tests
 */

import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';
import { DeleteUserInput } from '@domain/inbox/use-cases/DeleteUserInput';
import { UserInputNotFoundError } from '@domain/inbox/use-cases/errors';

import { createMockUserInput } from './testUtils';

describe('DeleteUserInput', () => {
  const mockRepository: Partial<InboxRepository> = {
    deleteUserInput: jest.fn(),
    getUserInputById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete user input', async () => {
    const existingInput = createMockUserInput({ id: '1', text: 'To delete' });

    (mockRepository.getUserInputById as jest.Mock).mockResolvedValue(existingInput);
    (mockRepository.deleteUserInput as jest.Mock).mockResolvedValue(undefined);

    await DeleteUserInput(mockRepository as InboxRepository, '1');

    expect(mockRepository.deleteUserInput).toHaveBeenCalledWith('1');
  });

  it('should throw UserInputNotFoundError if input does not exist', async () => {
    (mockRepository.getUserInputById as jest.Mock).mockResolvedValue(null);

    await expect(DeleteUserInput(mockRepository as InboxRepository, 'nonexistent')).rejects.toThrow(
      UserInputNotFoundError,
    );
  });

  it('should not throw if input exists and is deleted', async () => {
    const existingInput = createMockUserInput({ id: '1', text: 'Exists' });

    (mockRepository.getUserInputById as jest.Mock).mockResolvedValue(existingInput);
    (mockRepository.deleteUserInput as jest.Mock).mockResolvedValue(undefined);

    await expect(DeleteUserInput(mockRepository as InboxRepository, '1')).resolves.toBeUndefined();
  });
});
