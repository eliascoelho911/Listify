/**
 * useCreateUserInput Hook Tests
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
import { useCreateUserInput } from '@presentation/hooks/use-cases/useCreateUserInput';

describe('useCreateUserInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a function', () => {
    const { result } = renderHook(() => useCreateUserInput());

    expect(typeof result.current).toBe('function');
  });

  it('should call repository.createUserInput when invoked', async () => {
    const now = new Date();
    const mockInput = {
      id: 'test-id',
      text: 'Test input #tag',
      createdAt: now,
      updatedAt: now,
      tags: [{ id: 'tag-1', name: 'tag', usageCount: 1, createdAt: now }],
    };
    mockRepository.createUserInput.mockResolvedValue(mockInput);

    const { result } = renderHook(() => useCreateUserInput());

    const createdInput = await result.current({ text: 'Test input #tag' });

    expect(mockRepository.createUserInput).toHaveBeenCalledWith({
      text: 'Test input #tag',
    });
    expect(createdInput).toEqual(mockInput);
  });

  it('should throw EmptyTextError for empty text', async () => {
    const { result } = renderHook(() => useCreateUserInput());

    await expect(result.current({ text: '   ' })).rejects.toThrow('Input text cannot be empty');
  });

  it('should return stable function reference', () => {
    const { result, rerender } = renderHook(() => useCreateUserInput());

    const firstRef = result.current;
    rerender({});
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });
});
