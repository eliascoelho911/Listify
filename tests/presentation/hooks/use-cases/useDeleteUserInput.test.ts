/**
 * useDeleteUserInput Hook Tests
 */

import { renderHook } from '@testing-library/react-native';

import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';

// Mock repository
const mockRepository: jest.Mocked<InboxRepository> = {
  createUserInput: jest.fn(),
  updateUserInput: jest.fn(),
  deleteUserInput: jest.fn(),
  getUserInputById: jest.fn(),
  getUserInputs: jest.fn(),
  searchTags: jest.fn(),
  getAllTags: jest.fn(),
  transaction: jest.fn(),
};

// Mock useInboxRepository
jest.mock('@presentation/hooks/useInboxRepository', () => ({
  useInboxRepository: jest.fn(() => mockRepository),
}));

// Import after mocking
// eslint-disable-next-line import/first
import { useDeleteUserInput } from '@presentation/hooks/use-cases/useDeleteUserInput';

describe('useDeleteUserInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a function', () => {
    const { result } = renderHook(() => useDeleteUserInput());

    expect(typeof result.current).toBe('function');
  });

  it('should call repository.deleteUserInput when invoked', async () => {
    const now = new Date();
    const existingInput = {
      id: 'test-id',
      text: 'Test text',
      createdAt: now,
      updatedAt: now,
      tags: [],
    };

    mockRepository.getUserInputById.mockResolvedValue(existingInput);
    mockRepository.deleteUserInput.mockResolvedValue();

    const { result } = renderHook(() => useDeleteUserInput());

    await result.current('test-id');

    expect(mockRepository.getUserInputById).toHaveBeenCalledWith('test-id');
    expect(mockRepository.deleteUserInput).toHaveBeenCalledWith('test-id');
  });

  it('should throw UserInputNotFoundError for non-existent input', async () => {
    mockRepository.getUserInputById.mockResolvedValue(null);

    const { result } = renderHook(() => useDeleteUserInput());

    await expect(result.current('non-existent-id')).rejects.toThrow(
      'UserInput not found: non-existent-id',
    );
  });

  it('should return stable function reference', () => {
    const { result, rerender } = renderHook(() => useDeleteUserInput());

    const firstRef = result.current;
    rerender({});
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });
});
