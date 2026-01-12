/**
 * useUserInputsLive Hook Tests
 *
 * Unit tests for the reactive user inputs hook.
 * Tests the transformation of raw database data to domain entities.
 */

import { renderHook } from '@testing-library/react-native';

import type { UserInput } from '@domain/inbox/entities';

// Mock data types matching the raw query result shape
type RawInputTag = {
  inputId: string;
  tagId: string;
  tag: {
    id: string;
    name: string;
    usageCount: number;
    createdAt: string;
  };
};

type RawUserInput = {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  inputTags: RawInputTag[];
};

// Mock useLiveQuery result
let mockUseLiveQueryResult: {
  data: RawUserInput[] | undefined;
  error: Error | undefined;
  updatedAt: Date | undefined;
} = {
  data: undefined,
  error: undefined,
  updatedAt: undefined,
};

// Mock the drizzle modules
jest.mock('drizzle-orm', () => ({
  desc: jest.fn(() => 'desc'),
}));

jest.mock('drizzle-orm/expo-sqlite', () => ({
  useLiveQuery: jest.fn(() => mockUseLiveQueryResult),
}));

// Mock useAppDependencies to provide drizzleDb
jest.mock('@app/di/AppDependenciesProvider', () => ({
  useAppDependencies: jest.fn(() => ({
    drizzleDb: {
      query: {
        userInputs: {
          findMany: jest.fn(() => ({})),
        },
      },
    },
  })),
}));

jest.mock('@infra/drizzle/schema', () => ({
  userInputs: {
    updatedAt: 'updated_at',
  },
}));

// Import after mocking - must be after jest.mock() calls
// eslint-disable-next-line import/first
import { useUserInputsLive } from '@app/di/hooks/useUserInputsLive';

describe('useUserInputsLive', () => {
  beforeEach(() => {
    mockUseLiveQueryResult = {
      data: undefined,
      error: undefined,
      updatedAt: undefined,
    };
  });

  it('should return empty array when data is undefined', () => {
    mockUseLiveQueryResult = {
      data: undefined,
      error: undefined,
      updatedAt: undefined,
    };

    const { result } = renderHook(() => useUserInputsLive());

    expect(result.current.inputs).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should return empty array when data is empty array', () => {
    mockUseLiveQueryResult = {
      data: [],
      error: undefined,
      updatedAt: new Date(),
    };

    const { result } = renderHook(() => useUserInputsLive());

    expect(result.current.inputs).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should map raw data to domain entities', () => {
    const now = new Date();
    mockUseLiveQueryResult = {
      data: [
        {
          id: 'input-1',
          text: 'Buy milk #groceries',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          inputTags: [
            {
              inputId: 'input-1',
              tagId: 'tag-1',
              tag: {
                id: 'tag-1',
                name: 'groceries',
                usageCount: 5,
                createdAt: now.toISOString(),
              },
            },
          ],
        },
      ],
      error: undefined,
      updatedAt: now,
    };

    const { result } = renderHook(() => useUserInputsLive());

    expect(result.current.inputs).toHaveLength(1);
    expect(result.current.inputs[0].id).toBe('input-1');
    expect(result.current.inputs[0].text).toBe('Buy milk #groceries');
    expect(result.current.inputs[0].createdAt).toBeInstanceOf(Date);
    expect(result.current.inputs[0].updatedAt).toBeInstanceOf(Date);
    expect(result.current.inputs[0].tags).toHaveLength(1);
    expect(result.current.inputs[0].tags[0].name).toBe('groceries');
  });

  it('should set isLoading true while data is undefined', () => {
    mockUseLiveQueryResult = {
      data: undefined,
      error: undefined,
      updatedAt: undefined,
    };

    const { result } = renderHook(() => useUserInputsLive());

    expect(result.current.isLoading).toBe(true);
  });

  it('should set isLoading false when data is available', () => {
    mockUseLiveQueryResult = {
      data: [],
      error: undefined,
      updatedAt: new Date(),
    };

    const { result } = renderHook(() => useUserInputsLive());

    expect(result.current.isLoading).toBe(false);
  });

  it('should set isLoading false when error occurs', () => {
    mockUseLiveQueryResult = {
      data: undefined,
      error: new Error('Database error'),
      updatedAt: undefined,
    };

    const { result } = renderHook(() => useUserInputsLive());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('should pass error from useLiveQuery', () => {
    const testError = new Error('Test error');
    mockUseLiveQueryResult = {
      data: undefined,
      error: testError,
      updatedAt: undefined,
    };

    const { result } = renderHook(() => useUserInputsLive());

    expect(result.current.error).toBe(testError);
  });

  it('should return null error when no error occurs', () => {
    mockUseLiveQueryResult = {
      data: [],
      error: undefined,
      updatedAt: new Date(),
    };

    const { result } = renderHook(() => useUserInputsLive());

    expect(result.current.error).toBeNull();
  });

  it('should map input without tags correctly', () => {
    const now = new Date();
    mockUseLiveQueryResult = {
      data: [
        {
          id: 'input-1',
          text: 'Simple text',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          inputTags: [],
        },
      ],
      error: undefined,
      updatedAt: now,
    };

    const { result } = renderHook(() => useUserInputsLive());

    expect(result.current.inputs[0].tags).toHaveLength(0);
  });

  it('should map multiple tags correctly', () => {
    const now = new Date();
    mockUseLiveQueryResult = {
      data: [
        {
          id: 'input-1',
          text: 'Text #tag1 #tag2 #tag3',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          inputTags: [
            {
              inputId: 'input-1',
              tagId: 'tag-1',
              tag: { id: 'tag-1', name: 'tag1', usageCount: 1, createdAt: now.toISOString() },
            },
            {
              inputId: 'input-1',
              tagId: 'tag-2',
              tag: { id: 'tag-2', name: 'tag2', usageCount: 2, createdAt: now.toISOString() },
            },
            {
              inputId: 'input-1',
              tagId: 'tag-3',
              tag: { id: 'tag-3', name: 'tag3', usageCount: 3, createdAt: now.toISOString() },
            },
          ],
        },
      ],
      error: undefined,
      updatedAt: now,
    };

    const { result } = renderHook(() => useUserInputsLive());

    expect(result.current.inputs[0].tags).toHaveLength(3);
    expect(result.current.inputs[0].tags.map((t) => t.name)).toEqual(['tag1', 'tag2', 'tag3']);
  });

  it('should pass updatedAt from useLiveQuery', () => {
    const updateTime = new Date('2024-06-15T12:00:00Z');
    mockUseLiveQueryResult = {
      data: [],
      error: undefined,
      updatedAt: updateTime,
    };

    const { result } = renderHook(() => useUserInputsLive());

    expect(result.current.updatedAt).toBe(updateTime);
  });

  it('should convert date strings to Date objects', () => {
    const createdAt = '2024-01-15T10:00:00.000Z';
    const updatedAt = '2024-06-15T12:00:00.000Z';
    const tagCreatedAt = '2024-01-10T08:00:00.000Z';

    mockUseLiveQueryResult = {
      data: [
        {
          id: 'input-1',
          text: 'Test #tag',
          createdAt,
          updatedAt,
          inputTags: [
            {
              inputId: 'input-1',
              tagId: 'tag-1',
              tag: { id: 'tag-1', name: 'tag', usageCount: 1, createdAt: tagCreatedAt },
            },
          ],
        },
      ],
      error: undefined,
      updatedAt: new Date(),
    };

    const { result } = renderHook(() => useUserInputsLive());
    const input = result.current.inputs[0] as UserInput;

    expect(input.createdAt).toBeInstanceOf(Date);
    expect(input.updatedAt).toBeInstanceOf(Date);
    expect(input.tags[0].createdAt).toBeInstanceOf(Date);
    expect(input.createdAt.toISOString()).toBe(createdAt);
    expect(input.updatedAt.toISOString()).toBe(updatedAt);
    expect(input.tags[0].createdAt.toISOString()).toBe(tagCreatedAt);
  });
});
