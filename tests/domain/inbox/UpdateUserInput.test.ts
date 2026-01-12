/**
 * UpdateUserInput Use Case Tests
 */

import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';
import { EmptyTextError, UserInputNotFoundError } from '@domain/inbox/use-cases/errors';
import { UpdateUserInput } from '@domain/inbox/use-cases/UpdateUserInput';

import { createMockUserInput } from './testUtils';

describe('UpdateUserInput', () => {
  const mockRepository: Partial<InboxRepository> = {
    updateUserInput: jest.fn(),
    getUserInputById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update user input text', async () => {
    const existingInput = createMockUserInput({ id: '1', text: 'Original text' });
    const updatedInput = createMockUserInput({
      id: '1',
      text: 'Updated text',
      updatedAt: new Date(),
    });

    (mockRepository.getUserInputById as jest.Mock).mockResolvedValue(existingInput);
    (mockRepository.updateUserInput as jest.Mock).mockResolvedValue(updatedInput);

    const result = await UpdateUserInput(mockRepository as InboxRepository, '1', 'Updated text');

    expect(mockRepository.updateUserInput).toHaveBeenCalledWith({
      id: '1',
      text: 'Updated text',
    });
    expect(result.text).toBe('Updated text');
  });

  it('should throw UserInputNotFoundError if input does not exist', async () => {
    (mockRepository.getUserInputById as jest.Mock).mockResolvedValue(null);

    await expect(
      UpdateUserInput(mockRepository as InboxRepository, 'nonexistent', 'New text'),
    ).rejects.toThrow(UserInputNotFoundError);
  });

  it('should throw EmptyTextError if text is empty', async () => {
    const existingInput = createMockUserInput({ id: '1', text: 'Original text' });
    (mockRepository.getUserInputById as jest.Mock).mockResolvedValue(existingInput);

    await expect(UpdateUserInput(mockRepository as InboxRepository, '1', '')).rejects.toThrow(
      EmptyTextError,
    );
  });

  it('should throw EmptyTextError if text is only whitespace', async () => {
    const existingInput = createMockUserInput({ id: '1', text: 'Original text' });
    (mockRepository.getUserInputById as jest.Mock).mockResolvedValue(existingInput);

    await expect(UpdateUserInput(mockRepository as InboxRepository, '1', '   ')).rejects.toThrow(
      EmptyTextError,
    );
  });

  it('should trim whitespace from text', async () => {
    const existingInput = createMockUserInput({ id: '1', text: 'Original' });
    const updatedInput = createMockUserInput({
      id: '1',
      text: 'Updated text',
      updatedAt: new Date(),
    });

    (mockRepository.getUserInputById as jest.Mock).mockResolvedValue(existingInput);
    (mockRepository.updateUserInput as jest.Mock).mockResolvedValue(updatedInput);

    await UpdateUserInput(mockRepository as InboxRepository, '1', '  Updated text  ');

    expect(mockRepository.updateUserInput).toHaveBeenCalledWith({
      id: '1',
      text: 'Updated text',
    });
  });
});
