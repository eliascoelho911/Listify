/**
 * useSearchTags Hook Tests
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
import { useSearchTags } from '@presentation/hooks/use-cases/useSearchTags';

describe('useSearchTags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a function', () => {
    const { result } = renderHook(() => useSearchTags());

    expect(typeof result.current).toBe('function');
  });

  it('should call repository.searchTags when invoked', async () => {
    const now = new Date();
    const mockTags = [
      { id: 'tag-1', name: 'groceries', usageCount: 5, createdAt: now },
      { id: 'tag-2', name: 'green', usageCount: 2, createdAt: now },
    ];
    mockRepository.searchTags.mockResolvedValue(mockTags);

    const { result } = renderHook(() => useSearchTags());

    const tags = await result.current({ query: 'gr', limit: 5 });

    expect(mockRepository.searchTags).toHaveBeenCalledWith({ query: 'gr', limit: 5 });
    expect(tags).toEqual(mockTags);
  });

  it('should use default limit when not provided', async () => {
    mockRepository.searchTags.mockResolvedValue([]);

    const { result } = renderHook(() => useSearchTags());

    await result.current({ query: 'test' });

    expect(mockRepository.searchTags).toHaveBeenCalledWith({ query: 'test', limit: 5 });
  });

  it('should return empty array for empty query', async () => {
    mockRepository.searchTags.mockResolvedValue([]);

    const { result } = renderHook(() => useSearchTags());

    const tags = await result.current({ query: '' });

    expect(tags).toEqual([]);
  });

  it('should return stable function reference', () => {
    const { result, rerender } = renderHook(() => useSearchTags());

    const firstRef = result.current;
    rerender({});
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });
});
