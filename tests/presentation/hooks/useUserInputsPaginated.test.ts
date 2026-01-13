/**
 * useUserInputsPaginated Hook Tests
 *
 * Unit tests for the hybrid pagination hook.
 * Tests the combination of reactive live data with on-demand older inputs.
 */

import { act, renderHook } from '@testing-library/react-native';

import { DEFAULT_PAGE_SIZE, INITIAL_PAGE_SIZE } from '@domain/inbox/constants';
import type { UserInput } from '@domain/inbox/entities';
import { useUserInputsLive } from '@presentation/hooks/useUserInputsLive';
import { useUserInputsPaginated } from '@presentation/hooks/useUserInputsPaginated';

// Mock useInboxRepository
const mockGetUserInputs = jest.fn();

jest.mock('@app/di/AppDependenciesProvider', () => ({
  useInboxRepository: jest.fn(() => ({
    getUserInputs: mockGetUserInputs,
  })),
}));

// Mock useUserInputsLive
let mockLiveResult: {
  inputs: UserInput[];
  isLoading: boolean;
  error: Error | null;
  updatedAt: Date | undefined;
} = {
  inputs: [],
  isLoading: true,
  error: null,
  updatedAt: undefined,
};

jest.mock('@presentation/hooks/useUserInputsLive', () => ({
  useUserInputsLive: jest.fn(() => mockLiveResult),
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
const createMockInputs = (count: number, startId: number = 1): UserInput[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockInput(`input-${startId + i}`, `Text ${startId + i}`),
  );
};

describe('useUserInputsPaginated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLiveResult = {
      inputs: [],
      isLoading: true,
      error: null,
      updatedAt: undefined,
    };
    mockGetUserInputs.mockReset();
  });

  describe('initial state', () => {
    it('should return empty inputs when live data is loading', () => {
      mockLiveResult = {
        inputs: [],
        isLoading: true,
        error: null,
        updatedAt: undefined,
      };

      const { result } = renderHook(() => useUserInputsPaginated());

      expect(result.current.inputs).toEqual([]);
      expect(result.current.isLoading).toBe(true);
    });

    it('should set isLoading true during initial load', () => {
      mockLiveResult = {
        inputs: [],
        isLoading: true,
        error: null,
        updatedAt: undefined,
      };

      const { result } = renderHook(() => useUserInputsPaginated());

      expect(result.current.isLoading).toBe(true);
    });

    it('should set hasMore true when live inputs >= INITIAL_PAGE_SIZE', () => {
      mockLiveResult = {
        inputs: createMockInputs(INITIAL_PAGE_SIZE),
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      const { result } = renderHook(() => useUserInputsPaginated());

      expect(result.current.hasMore).toBe(true);
    });

    it('should set hasMore false when live inputs < INITIAL_PAGE_SIZE', () => {
      mockLiveResult = {
        inputs: createMockInputs(10),
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      const { result } = renderHook(() => useUserInputsPaginated());

      expect(result.current.hasMore).toBe(false);
    });
  });

  describe('live inputs', () => {
    it('should return live inputs from useUserInputsLive', () => {
      const liveInputs = createMockInputs(5);
      mockLiveResult = {
        inputs: liveInputs,
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      const { result } = renderHook(() => useUserInputsPaginated());

      expect(result.current.inputs).toEqual(liveInputs);
    });

    it('should pass INITIAL_PAGE_SIZE as limit to useUserInputsLive', () => {
      renderHook(() => useUserInputsPaginated());

      expect(useUserInputsLive).toHaveBeenCalledWith(INITIAL_PAGE_SIZE);
    });

    it('should update when live data changes', () => {
      const initialInputs = createMockInputs(3);
      mockLiveResult = {
        inputs: initialInputs,
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      const { result, rerender } = renderHook(() => useUserInputsPaginated());
      expect(result.current.inputs).toHaveLength(3);

      // Simulate live data update
      const newInput = createMockInput('input-new', 'New input');
      mockLiveResult = {
        inputs: [newInput, ...initialInputs],
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      rerender({});

      expect(result.current.inputs).toHaveLength(4);
      expect(result.current.inputs[0].id).toBe('input-new');
    });
  });

  describe('loadMore', () => {
    it('should not load more when hasMore is false', async () => {
      mockLiveResult = {
        inputs: createMockInputs(10),
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      const { result } = renderHook(() => useUserInputsPaginated());

      await act(async () => {
        await result.current.loadMore();
      });

      expect(mockGetUserInputs).not.toHaveBeenCalled();
    });

    it('should not load more when already loading', async () => {
      mockLiveResult = {
        inputs: createMockInputs(INITIAL_PAGE_SIZE),
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      mockGetUserInputs.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve({ items: [], hasMore: false }), 100)),
      );

      const { result } = renderHook(() => useUserInputsPaginated());

      // Start first load
      act(() => {
        result.current.loadMore();
      });

      // Try to start second load while first is in progress
      await act(async () => {
        await result.current.loadMore();
      });

      // Should only be called once
      expect(mockGetUserInputs).toHaveBeenCalledTimes(1);
    });

    it('should set isLoadingMore true during load', async () => {
      mockLiveResult = {
        inputs: createMockInputs(INITIAL_PAGE_SIZE),
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      let resolvePromise: (value: { items: UserInput[]; hasMore: boolean }) => void;
      mockGetUserInputs.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          }),
      );

      const { result } = renderHook(() => useUserInputsPaginated());

      act(() => {
        result.current.loadMore();
      });

      expect(result.current.isLoadingMore).toBe(true);

      await act(async () => {
        resolvePromise!({ items: [], hasMore: false });
      });

      expect(result.current.isLoadingMore).toBe(false);
    });

    it('should append older inputs after loadMore', async () => {
      const liveInputs = createMockInputs(INITIAL_PAGE_SIZE);
      mockLiveResult = {
        inputs: liveInputs,
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      const olderInputs = createMockInputs(DEFAULT_PAGE_SIZE, INITIAL_PAGE_SIZE + 1);
      mockGetUserInputs.mockResolvedValue({
        items: olderInputs,
        hasMore: true,
      });

      const { result } = renderHook(() => useUserInputsPaginated());

      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.inputs).toHaveLength(INITIAL_PAGE_SIZE + DEFAULT_PAGE_SIZE);
    });

    it('should increment page after successful load', async () => {
      mockLiveResult = {
        inputs: createMockInputs(INITIAL_PAGE_SIZE),
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      mockGetUserInputs.mockResolvedValue({
        items: createMockInputs(DEFAULT_PAGE_SIZE, 100),
        hasMore: true,
      });

      const { result } = renderHook(() => useUserInputsPaginated());

      // First call should be page 1
      await act(async () => {
        await result.current.loadMore();
      });

      expect(mockGetUserInputs).toHaveBeenCalledWith({
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
      });

      // Second call should be page 2
      await act(async () => {
        await result.current.loadMore();
      });

      expect(mockGetUserInputs).toHaveBeenCalledWith({
        page: 2,
        limit: DEFAULT_PAGE_SIZE,
      });
    });

    it('should set hasMore false when no more data', async () => {
      mockLiveResult = {
        inputs: createMockInputs(INITIAL_PAGE_SIZE),
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      mockGetUserInputs.mockResolvedValue({
        items: createMockInputs(5, 100),
        hasMore: false,
      });

      const { result } = renderHook(() => useUserInputsPaginated());

      expect(result.current.hasMore).toBe(true);

      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.hasMore).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      mockLiveResult = {
        inputs: createMockInputs(INITIAL_PAGE_SIZE),
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      const testError = new Error('Network error');
      mockGetUserInputs.mockRejectedValue(testError);

      const { result } = renderHook(() => useUserInputsPaginated());

      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.isLoadingMore).toBe(false);
    });
  });

  describe('merge and deduplication', () => {
    it('should merge live and older inputs', async () => {
      const liveInputs = createMockInputs(INITIAL_PAGE_SIZE);
      mockLiveResult = {
        inputs: liveInputs,
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      const olderInputs = createMockInputs(10, 100);
      mockGetUserInputs.mockResolvedValue({
        items: olderInputs,
        hasMore: false,
      });

      const { result } = renderHook(() => useUserInputsPaginated());

      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.inputs).toHaveLength(INITIAL_PAGE_SIZE + 10);
    });

    it('should deduplicate inputs that appear in both live and older', async () => {
      // Create live inputs with IDs 1-50
      const liveInputs = createMockInputs(INITIAL_PAGE_SIZE);
      mockLiveResult = {
        inputs: liveInputs,
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      // Older inputs include some duplicates (IDs 1-5) plus new ones (100-110)
      const duplicates = createMockInputs(5); // IDs 1-5 (duplicates)
      const newOlder = createMockInputs(10, 100); // IDs 100-110 (new)
      mockGetUserInputs.mockResolvedValue({
        items: [...duplicates, ...newOlder],
        hasMore: false,
      });

      const { result } = renderHook(() => useUserInputsPaginated());

      await act(async () => {
        await result.current.loadMore();
      });

      // Should have 50 live + 10 new older (duplicates filtered out)
      expect(result.current.inputs).toHaveLength(INITIAL_PAGE_SIZE + 10);

      // Check no duplicate IDs
      const ids = result.current.inputs.map((i) => i.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should prioritize live version over older version', async () => {
      // Create live input with specific text
      const liveInput = createMockInput('input-1', 'Live version');
      mockLiveResult = {
        inputs: [liveInput],
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      // Older input with same ID but different text
      const olderInput = createMockInput('input-1', 'Older version');
      mockGetUserInputs.mockResolvedValue({
        items: [olderInput],
        hasMore: false,
      });

      // First render with hasMore=false (only 1 live input)
      renderHook(() => useUserInputsPaginated());

      // Now set up scenario where we can test deduplication with hasMore=true
      mockLiveResult = {
        inputs: createMockInputs(INITIAL_PAGE_SIZE),
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      const { result } = renderHook(() => useUserInputsPaginated());

      await act(async () => {
        await result.current.loadMore();
      });

      // The live version should be present, not the older version
      const foundInput = result.current.inputs.find((i) => i.id === 'input-1');
      expect(foundInput?.text).toBe('Text 1'); // From createMockInputs
    });

    it('should maintain order: live first, then older', async () => {
      const liveInputs = createMockInputs(INITIAL_PAGE_SIZE);
      mockLiveResult = {
        inputs: liveInputs,
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      const olderInputs = createMockInputs(10, 100);
      mockGetUserInputs.mockResolvedValue({
        items: olderInputs,
        hasMore: false,
      });

      const { result } = renderHook(() => useUserInputsPaginated());

      await act(async () => {
        await result.current.loadMore();
      });

      // First 50 should be live inputs
      for (let i = 0; i < INITIAL_PAGE_SIZE; i++) {
        expect(result.current.inputs[i].id).toBe(`input-${i + 1}`);
      }

      // Next 10 should be older inputs (IDs start at 100)
      for (let i = 0; i < 10; i++) {
        expect(result.current.inputs[INITIAL_PAGE_SIZE + i].id).toBe(`input-${100 + i}`);
      }
    });
  });

  describe('error handling', () => {
    it('should pass error from live query', () => {
      const liveError = new Error('Live query error');
      mockLiveResult = {
        inputs: [],
        isLoading: false,
        error: liveError,
        updatedAt: undefined,
      };

      const { result } = renderHook(() => useUserInputsPaginated());

      expect(result.current.error).toBe(liveError);
    });

    it('should set error when loadMore fails', async () => {
      mockLiveResult = {
        inputs: createMockInputs(INITIAL_PAGE_SIZE),
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      mockGetUserInputs.mockRejectedValue(new Error('Load more error'));

      const { result } = renderHook(() => useUserInputsPaginated());

      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.error?.message).toBe('Load more error');
    });

    it('should continue working after error recovery', async () => {
      mockLiveResult = {
        inputs: createMockInputs(INITIAL_PAGE_SIZE),
        isLoading: false,
        error: null,
        updatedAt: new Date(),
      };

      // First call fails
      mockGetUserInputs.mockRejectedValueOnce(new Error('Temporary error'));

      const { result } = renderHook(() => useUserInputsPaginated());

      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.error).toBeTruthy();

      // Second call succeeds
      mockGetUserInputs.mockResolvedValueOnce({
        items: createMockInputs(10, 100),
        hasMore: false,
      });

      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.inputs.length).toBeGreaterThan(INITIAL_PAGE_SIZE);
    });
  });

  describe('not loading during initial load', () => {
    it('should not load more when initial data is still loading', async () => {
      mockLiveResult = {
        inputs: [],
        isLoading: true,
        error: null,
        updatedAt: undefined,
      };

      const { result } = renderHook(() => useUserInputsPaginated());

      await act(async () => {
        await result.current.loadMore();
      });

      expect(mockGetUserInputs).not.toHaveBeenCalled();
    });
  });
});
