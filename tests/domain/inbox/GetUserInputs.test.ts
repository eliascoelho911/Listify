/**
 * GetUserInputs Use Case Tests
 */

import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';
import { GetUserInputs } from '@domain/inbox/use-cases/GetUserInputs';

import { createMockUserInput } from './testUtils';

describe('GetUserInputs', () => {
  const mockRepository: InboxRepository = {
    create: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    searchTags: jest.fn(),
    getOrCreateTag: jest.fn(),
    deleteUnusedTags: jest.fn(),
    countInputs: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated inputs with defaults', async () => {
    const mockInputs = [
      createMockUserInput({ id: '1', text: 'First input' }),
      createMockUserInput({ id: '2', text: 'Second input' }),
    ];

    (mockRepository.getAll as jest.Mock).mockResolvedValue(mockInputs);
    (mockRepository.countInputs as jest.Mock).mockResolvedValue(2);

    const result = await GetUserInputs(mockRepository);

    expect(mockRepository.getAll).toHaveBeenCalledWith(0, 20);
    expect(result).toEqual({
      items: mockInputs,
      total: 2,
      offset: 0,
      limit: 20,
      hasMore: false,
    });
  });

  it('should return paginated inputs with custom offset and limit', async () => {
    const mockInputs = [createMockUserInput({ id: '3', text: 'Third input' })];

    (mockRepository.getAll as jest.Mock).mockResolvedValue(mockInputs);
    (mockRepository.countInputs as jest.Mock).mockResolvedValue(10);

    const result = await GetUserInputs(mockRepository, 5, 5);

    expect(mockRepository.getAll).toHaveBeenCalledWith(5, 5);
    expect(result).toEqual({
      items: mockInputs,
      total: 10,
      offset: 5,
      limit: 5,
      hasMore: true,
    });
  });

  it('should indicate hasMore when more items exist', async () => {
    const mockInputs = Array.from({ length: 20 }, (_, i) =>
      createMockUserInput({ id: `${i}`, text: `Input ${i}` }),
    );

    (mockRepository.getAll as jest.Mock).mockResolvedValue(mockInputs);
    (mockRepository.countInputs as jest.Mock).mockResolvedValue(25);

    const result = await GetUserInputs(mockRepository, 0, 20);

    expect(result.hasMore).toBe(true);
  });

  it('should return empty array when no inputs exist', async () => {
    (mockRepository.getAll as jest.Mock).mockResolvedValue([]);
    (mockRepository.countInputs as jest.Mock).mockResolvedValue(0);

    const result = await GetUserInputs(mockRepository);

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.hasMore).toBe(false);
  });
});
