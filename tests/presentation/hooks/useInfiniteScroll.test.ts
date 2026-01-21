/**
 * useInfiniteScroll Hook Tests
 */

import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useInfiniteScroll } from '@presentation/hooks/useInfiniteScroll';

interface TestItem {
  id: string;
  name: string;
}

const createMockItems = (count: number, startId: number = 0): TestItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${startId + i}`,
    name: `Item ${startId + i}`,
  }));
};

describe('useInfiniteScroll', () => {
  it('should initialize with empty items', () => {
    const fetchPage = jest.fn();
    const { result } = renderHook(() => useInfiniteScroll<TestItem>({ fetchPage }));

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });

  it('should load first page of items', async () => {
    const mockItems = createMockItems(10);
    const fetchPage = jest.fn().mockResolvedValue({ data: mockItems, total: 30 });

    const { result } = renderHook(() => useInfiniteScroll<TestItem>({ fetchPage, pageSize: 10 }));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.items).toHaveLength(10);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.total).toBe(30);
    expect(fetchPage).toHaveBeenCalledWith(0, 10);
  });

  it('should load subsequent pages', async () => {
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce({ data: createMockItems(10, 0), total: 30 })
      .mockResolvedValueOnce({ data: createMockItems(10, 10), total: 30 });

    const { result } = renderHook(() => useInfiniteScroll<TestItem>({ fetchPage, pageSize: 10 }));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.items).toHaveLength(10);

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.items).toHaveLength(20);
    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(fetchPage).toHaveBeenLastCalledWith(10, 10);
  });

  it('should set hasMore to false when all items loaded', async () => {
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce({ data: createMockItems(10, 0), total: 15 })
      .mockResolvedValueOnce({ data: createMockItems(5, 10), total: 15 });

    const { result } = renderHook(() => useInfiniteScroll<TestItem>({ fetchPage, pageSize: 10 }));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.hasMore).toBe(true);

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.hasMore).toBe(false);
  });

  it('should not load if already loading', async () => {
    let resolvePromise: (value: { data: TestItem[]; total: number }) => void;
    const fetchPage = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    const { result } = renderHook(() => useInfiniteScroll<TestItem>({ fetchPage, pageSize: 10 }));

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.loadMore();
    });

    expect(fetchPage).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolvePromise!({ data: createMockItems(10), total: 30 });
    });
  });

  it('should not load if hasMore is false', async () => {
    const fetchPage = jest.fn().mockResolvedValue({
      data: createMockItems(5),
      total: 5,
    });

    const { result } = renderHook(() => useInfiniteScroll<TestItem>({ fetchPage, pageSize: 10 }));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.hasMore).toBe(false);

    await act(async () => {
      await result.current.loadMore();
    });

    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it('should refresh and reset items', async () => {
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce({ data: createMockItems(10, 0), total: 30 })
      .mockResolvedValueOnce({ data: createMockItems(10, 100), total: 30 });

    const { result } = renderHook(() => useInfiniteScroll<TestItem>({ fetchPage, pageSize: 10 }));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.items[0].id).toBe('0');

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.items).toHaveLength(10);
    expect(result.current.items[0].id).toBe('100');
  });

  it('should reset all state', async () => {
    const fetchPage = jest.fn().mockResolvedValue({
      data: createMockItems(10),
      total: 30,
    });

    const { result } = renderHook(() => useInfiniteScroll<TestItem>({ fetchPage, pageSize: 10 }));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.items).toHaveLength(10);

    act(() => {
      result.current.reset();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.total).toBe(0);
  });

  it('should handle errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
    const fetchPage = jest.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useInfiniteScroll<TestItem>({ fetchPage, pageSize: 10 }));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
