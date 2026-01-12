/**
 * Test utilities for Inbox domain tests
 */

import type { Tag, UserInput } from '@domain/inbox/entities';
import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';

/**
 * Mock repository type with test helper properties
 */
export type MockInboxRepository = InboxRepository & {
  inputs: UserInput[];
  tags: Tag[];
};

let idCounter = 0;

/**
 * Generates a unique ID for tests
 */
export function generateTestId(): string {
  idCounter += 1;
  return `test-id-${idCounter}`;
}

/**
 * Resets the ID counter (call in beforeEach)
 */
export function resetTestIds(): void {
  idCounter = 0;
}

/**
 * Creates a mock Tag for testing
 */
export function createMockTag(overrides: Partial<Tag> = {}): Tag {
  return {
    id: generateTestId(),
    name: 'compras',
    usageCount: 1,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

/**
 * Creates a mock UserInput for testing
 */
export function createMockUserInput(overrides: Partial<UserInput> = {}): UserInput {
  const now = new Date('2024-01-15T10:00:00.000Z');
  return {
    id: generateTestId(),
    text: 'Test input text',
    createdAt: now,
    updatedAt: now,
    tags: [],
    ...overrides,
  };
}

/**
 * Creates multiple mock Tags for testing
 */
export function createMockTags(count: number): Tag[] {
  const tagNames = ['compras', 'mercado', 'urgente', 'casa', 'trabalho'];
  return Array.from({ length: count }, (_, i) =>
    createMockTag({
      name: tagNames[i % tagNames.length],
      usageCount: count - i,
    }),
  );
}

/**
 * Creates multiple mock UserInputs for testing
 */
export function createMockUserInputs(count: number): UserInput[] {
  return Array.from({ length: count }, (_, i) =>
    createMockUserInput({
      text: `Test input ${i + 1}`,
      createdAt: new Date(Date.now() - i * 86400000), // Each day older
      updatedAt: new Date(Date.now() - i * 86400000),
    }),
  );
}

/**
 * Mock InboxRepository implementation for testing
 */
export function createMockInboxRepository(): MockInboxRepository {
  const inputs: UserInput[] = [];
  const tags: Tag[] = [];

  return {
    inputs,
    tags,

    async createUserInput(params: { text: string }): Promise<UserInput> {
      const input = createMockUserInput({ text: params.text });
      inputs.push(input);
      return input;
    },

    async updateUserInput(params: { id: string; text?: string }): Promise<UserInput> {
      const index = inputs.findIndex((i) => i.id === params.id);
      if (index === -1) throw new Error('Not found');
      inputs[index] = { ...inputs[index], text: params.text ?? inputs[index].text };
      return inputs[index];
    },

    async deleteUserInput(id: string): Promise<void> {
      const index = inputs.findIndex((i) => i.id === id);
      if (index === -1) throw new Error('Not found');
      inputs.splice(index, 1);
    },

    async getUserInputById(id: string): Promise<UserInput | null> {
      return inputs.find((i) => i.id === id) ?? null;
    },

    async getUserInputs(params: { page: number; limit?: number }) {
      const limit = params.limit ?? 20;
      const offset = params.page * limit;
      const pageInputs = inputs.slice(offset, offset + limit);
      return {
        inputs: pageInputs,
        hasMore: inputs.length > offset + limit,
        total: inputs.length,
      };
    },

    async searchTags(params: { query: string; limit?: number }): Promise<Tag[]> {
      const limit = params.limit ?? 10;
      return tags.filter((t) => t.name.startsWith(params.query.toLowerCase())).slice(0, limit);
    },

    async getAllTags(): Promise<Tag[]> {
      return [...tags];
    },

    async transaction<T>(fn: (repo: typeof this) => Promise<T>): Promise<T> {
      return fn(this);
    },
  };
}
