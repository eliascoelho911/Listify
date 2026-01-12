/**
 * useUpdateUserInput Hook Tests
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
import { useUpdateUserInput } from '@presentation/hooks/use-cases/useUpdateUserInput';

describe('useUpdateUserInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a function', () => {
    const { result } = renderHook(() => useUpdateUserInput());

    expect(typeof result.current).toBe('function');
  });

  it('should call repository.updateUserInput when invoked', async () => {
    const now = new Date();
    const existingInput = {
      id: 'test-id',
      text: 'Old text',
      createdAt: now,
      updatedAt: now,
      tags: [],
    };
    const updatedInput = {
      ...existingInput,
      text: 'Updated text #newtag',
      updatedAt: new Date(),
      tags: [{ id: 'tag-1', name: 'newtag', usageCount: 1, createdAt: now }],
    };

    mockRepository.getUserInputById.mockResolvedValue(existingInput);
    mockRepository.updateUserInput.mockResolvedValue(updatedInput);

    const { result } = renderHook(() => useUpdateUserInput());

    const resultInput = await result.current('test-id', 'Updated text #newtag');

    expect(mockRepository.getUserInputById).toHaveBeenCalledWith('test-id');
    expect(mockRepository.updateUserInput).toHaveBeenCalledWith({
      id: 'test-id',
      text: 'Updated text #newtag',
    });
    expect(resultInput).toEqual(updatedInput);
  });

  it('should throw EmptyTextError for empty text', async () => {
    const { result } = renderHook(() => useUpdateUserInput());

    await expect(result.current('test-id', '   ')).rejects.toThrow('Input text cannot be empty');
  });

  it('should throw UserInputNotFoundError for non-existent input', async () => {
    mockRepository.getUserInputById.mockResolvedValue(null);

    const { result } = renderHook(() => useUpdateUserInput());

    await expect(result.current('non-existent-id', 'Some text')).rejects.toThrow(
      'UserInput not found: non-existent-id',
    );
  });

  it('should return stable function reference', () => {
    const { result, rerender } = renderHook(() => useUpdateUserInput());

    const firstRef = result.current;
    rerender({});
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });
});
