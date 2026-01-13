/**
 * GetUserInputs Use Case Tests
 */

import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';
import { GetUserInputs } from '@domain/inbox/use-cases/GetUserInputs';

import { createMockUserInput } from './testUtils';

describe('GetUserInputs', () => {
  const mockRepository: InboxRepository = {
    subscribeToInputs: jest.fn(),
    createUserInput: jest.fn(),
    updateUserInput: jest.fn(),
    deleteUserInput: jest.fn(),
    getUserInputById: jest.fn(),
    getUserInputs: jest.fn(),
    searchTags: jest.fn(),
    getAllTags: jest.fn(),
    transaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated inputs with defaults', async () => {
    const mockInputs = [
      createMockUserInput({ id: '1', text: 'First input' }),
      createMockUserInput({ id: '2', text: 'Second input' }),
    ];

    (mockRepository.getUserInputs as jest.Mock).mockResolvedValue({
      items: mockInputs,
      total: 2,
      offset: 0,
      limit: 20,
      hasMore: false,
    });

    const result = await GetUserInputs(mockRepository);

    expect(mockRepository.getUserInputs).toHaveBeenCalledWith({ page: 0, limit: 20 });
    expect(result).toEqual({
      items: mockInputs,
      total: 2,
      offset: 0,
      limit: 20,
      hasMore: false,
    });
  });

  it('should return paginated inputs with custom page and limit', async () => {
    const mockInputs = [createMockUserInput({ id: '3', text: 'Third input' })];

    (mockRepository.getUserInputs as jest.Mock).mockResolvedValue({
      items: mockInputs,
      total: 10,
      offset: 25,
      limit: 5,
      hasMore: true,
    });

    const result = await GetUserInputs(mockRepository, 5, 5);

    expect(mockRepository.getUserInputs).toHaveBeenCalledWith({ page: 5, limit: 5 });
    expect(result).toEqual({
      items: mockInputs,
      total: 10,
      offset: 25,
      limit: 5,
      hasMore: true,
    });
  });

  it('should indicate hasMore when more items exist', async () => {
    const mockInputs = Array.from({ length: 20 }, (_, i) =>
      createMockUserInput({ id: `${i}`, text: `Input ${i}` }),
    );

    (mockRepository.getUserInputs as jest.Mock).mockResolvedValue({
      items: mockInputs,
      total: 25,
      offset: 0,
      limit: 20,
      hasMore: true,
    });

    const result = await GetUserInputs(mockRepository, 0, 20);

    expect(result.hasMore).toBe(true);
  });

  it('should return empty array when no inputs exist', async () => {
    (mockRepository.getUserInputs as jest.Mock).mockResolvedValue({
      items: [],
      total: 0,
      offset: 0,
      limit: 20,
      hasMore: false,
    });

    const result = await GetUserInputs(mockRepository);

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.hasMore).toBe(false);
  });
});
