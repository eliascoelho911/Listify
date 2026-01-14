/**
 * useUserInputsCursor Hook Tests
 *
 * Unit tests for the cursor-based pagination hook.
 * Tests the essential behavior of loading and error handling.
 */

import { renderHook, waitFor } from '@testing-library/react-native';

import { INITIAL_PAGE_SIZE } from '@domain/inbox/constants';
import type { PaginatedUserInputs, UserInput } from '@domain/inbox/entities';
import { useUserInputsCursor } from '@presentation/hooks/useUserInputsCursor';

// Mock useInboxRepository
const mockGetUserInputs = jest.fn();

jest.mock('@app/di/AppDependenciesProvider', () => ({
  useInboxRepository: jest.fn(() => ({
    getUserInputs: mockGetUserInputs,
  })),
}));

// Helper to create mock UserInput
const createMockInput = (id: string, text: string): UserInput => ({
  id,
  text,
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
  tags: [],
});

// Helper to create multiple mock inputs
const createMockInputs = (count: number): UserInput[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockInput(`input-${i + 1}`, `Text ${i + 1}`),
  );
};

// Helper to create paginated response
const createPaginatedResponse = (items: UserInput[], hasMore: boolean): PaginatedUserInputs => {
  const lastItem = items[items.length - 1];
  return {
    items,
    hasMore,
    nextCursor: lastItem ? { createdAt: lastItem.createdAt.toISOString(), id: lastItem.id } : null,
    limit: items.length,
  };
};

describe('useUserInputsCursor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserInputs.mockReset();
  });

  describe('initial state', () => {
    it('should start with loading state', () => {
      mockGetUserInputs.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useUserInputsCursor());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.inputs).toEqual([]);
      expect(result.current.hasMore).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoadingMore).toBe(false);
    });

    it('should expose loadMore and refetch functions', () => {
      mockGetUserInputs.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useUserInputsCursor());

      expect(typeof result.current.loadMore).toBe('function');
      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('initial load', () => {
    it('should call repository with correct params on mount', async () => {
      mockGetUserInputs.mockResolvedValue(createPaginatedResponse([], false));

      renderHook(() => useUserInputsCursor());

      await waitFor(() => {
        expect(mockGetUserInputs).toHaveBeenCalledWith({
          cursor: undefined,
          limit: INITIAL_PAGE_SIZE,
        });
      });
    });

    it('should populate inputs after successful load', async () => {
      const mockInputs = createMockInputs(10);
      mockGetUserInputs.mockResolvedValue(createPaginatedResponse(mockInputs, false));

      const { result } = renderHook(() => useUserInputsCursor());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.inputs).toHaveLength(10);
      });
    });

    it('should set hasMore true when response indicates more data', async () => {
      const mockInputs = createMockInputs(50);
      mockGetUserInputs.mockResolvedValue(createPaginatedResponse(mockInputs, true));

      const { result } = renderHook(() => useUserInputsCursor());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasMore).toBe(true);
    });

    it('should set hasMore false when response indicates no more data', async () => {
      const mockInputs = createMockInputs(10);
      mockGetUserInputs.mockResolvedValue(createPaginatedResponse(mockInputs, false));

      const { result } = renderHook(() => useUserInputsCursor());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasMore).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty response', async () => {
      mockGetUserInputs.mockResolvedValue(createPaginatedResponse([], false));

      const { result } = renderHook(() => useUserInputsCursor());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.inputs).toEqual([]);
      expect(result.current.hasMore).toBe(false);
    });
  });
});
