/**
 * SearchTags Use Case Tests
 */

import type { Tag } from '@domain/inbox/entities';
import { SearchTags } from '@domain/inbox/use-cases/SearchTags';

import { createMockTag, resetTestIds } from './testUtils';

describe('SearchTags', () => {
  beforeEach(() => {
    resetTestIds();
  });

  it('should return matching tags based on prefix', async () => {
    const tags: Tag[] = [
      createMockTag({ name: 'compras', usageCount: 10 }),
      createMockTag({ name: 'casa', usageCount: 5 }),
      createMockTag({ name: 'comida', usageCount: 3 }),
    ];

    const mockSearchTags = jest
      .fn()
      .mockResolvedValue(tags.filter((t) => t.name.startsWith('com')));

    const result = await SearchTags({ query: 'com', limit: 10 }, mockSearchTags);

    expect(mockSearchTags).toHaveBeenCalledWith({ query: 'com', limit: 10 });
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('compras');
    expect(result[1].name).toBe('comida');
  });

  it('should return empty array when no tags match', async () => {
    const mockSearchTags = jest.fn().mockResolvedValue([]);

    const result = await SearchTags({ query: 'xyz', limit: 10 }, mockSearchTags);

    expect(mockSearchTags).toHaveBeenCalledWith({ query: 'xyz', limit: 10 });
    expect(result).toHaveLength(0);
  });

  it('should use default limit when not provided', async () => {
    const mockSearchTags = jest.fn().mockResolvedValue([]);

    await SearchTags({ query: 'test' }, mockSearchTags);

    expect(mockSearchTags).toHaveBeenCalledWith({ query: 'test', limit: 5 });
  });

  it('should handle empty query', async () => {
    const mockSearchTags = jest.fn().mockResolvedValue([]);

    const result = await SearchTags({ query: '' }, mockSearchTags);

    expect(mockSearchTags).toHaveBeenCalledWith({ query: '', limit: 5 });
    expect(result).toEqual([]);
  });

  it('should pass through limit parameter', async () => {
    const mockSearchTags = jest.fn().mockResolvedValue([]);

    await SearchTags({ query: 'test', limit: 3 }, mockSearchTags);

    expect(mockSearchTags).toHaveBeenCalledWith({ query: 'test', limit: 3 });
  });
});
