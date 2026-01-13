/**
 * Mock InboxRepository for Storybook stories.
 *
 * Provides a functional mock implementation that can be customized
 * for different story scenarios.
 */

import type { PaginatedUserInputs, Tag, UserInput } from '@domain/inbox/entities';
import type {
  CreateUserInputParams,
  GetUserInputsParams,
  InboxRepository,
  SearchTagsParams,
  SubscribeToInputsOptions,
  UpdateUserInputParams,
} from '@domain/inbox/ports/InboxRepository';

import { mockTags, mockUserInputs } from './inboxMocks';

type SubscriptionCallback = (inputs: UserInput[]) => void;

export type MockInboxRepositoryOptions = {
  /** Initial inputs to use */
  initialInputs?: UserInput[];
  /** Initial tags to use */
  initialTags?: Tag[];
  /** Simulate loading delay in ms */
  loadingDelay?: number;
  /** Simulate errors */
  simulateError?: boolean;
};

/**
 * Creates a mock InboxRepository for testing and stories.
 *
 * Supports:
 * - Subscriptions with automatic notification
 * - CRUD operations that update state
 * - Configurable initial data
 * - Simulated loading delays
 * - Error simulation
 */
export function createMockInboxRepository(
  options: MockInboxRepositoryOptions = {},
): InboxRepository {
  const {
    initialInputs = mockUserInputs,
    initialTags = mockTags,
    loadingDelay = 0,
    simulateError = false,
  } = options;

  let currentInputs = [...initialInputs];
  const currentTags = [...initialTags];
  const subscribers: Map<SubscriptionCallback, { limit?: number }> = new Map();

  const notifySubscribers = (): void => {
    for (const [callback, opts] of subscribers) {
      const inputsToSend = opts.limit ? currentInputs.slice(0, opts.limit) : currentInputs;
      callback(inputsToSend);
    }
  };

  const delay = (): Promise<void> =>
    loadingDelay > 0
      ? new Promise((resolve) => setTimeout(resolve, loadingDelay))
      : Promise.resolve();

  const throwIfError = (): void => {
    if (simulateError) {
      throw new Error('Simulated error');
    }
  };

  return {
    subscribeToInputs(
      callback: SubscriptionCallback,
      options?: SubscribeToInputsOptions,
    ): () => void {
      subscribers.set(callback, { limit: options?.limit });

      // Emit initial data after a microtask to simulate async behavior
      Promise.resolve().then(() => {
        if (subscribers.has(callback)) {
          const inputsToSend = options?.limit
            ? currentInputs.slice(0, options.limit)
            : currentInputs;
          callback(inputsToSend);
        }
      });

      return () => {
        subscribers.delete(callback);
      };
    },

    async createUserInput(params: CreateUserInputParams): Promise<UserInput> {
      await delay();
      throwIfError();

      const newInput: UserInput = {
        id: `input-${Date.now()}`,
        text: params.text,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };

      currentInputs = [newInput, ...currentInputs];
      notifySubscribers();

      return newInput;
    },

    async updateUserInput(params: UpdateUserInputParams): Promise<UserInput> {
      await delay();
      throwIfError();

      const index = currentInputs.findIndex((i) => i.id === params.id);
      if (index === -1) {
        throw new Error(`UserInput not found: ${params.id}`);
      }

      const existing = currentInputs[index];
      const updated: UserInput = {
        ...existing,
        text: params.text ?? existing.text,
        updatedAt: new Date(),
      };

      currentInputs = [
        ...currentInputs.slice(0, index),
        updated,
        ...currentInputs.slice(index + 1),
      ];
      notifySubscribers();

      return updated;
    },

    async deleteUserInput(id: string): Promise<void> {
      await delay();
      throwIfError();

      const index = currentInputs.findIndex((i) => i.id === id);
      if (index === -1) {
        throw new Error(`UserInput not found: ${id}`);
      }

      currentInputs = currentInputs.filter((i) => i.id !== id);
      notifySubscribers();
    },

    async getUserInputById(id: string): Promise<UserInput | null> {
      await delay();
      throwIfError();

      return currentInputs.find((i) => i.id === id) ?? null;
    },

    async getUserInputs(params: GetUserInputsParams): Promise<PaginatedUserInputs> {
      await delay();
      throwIfError();

      const limit = params.limit ?? 20;
      const offset = params.page * limit;
      const items = currentInputs.slice(offset, offset + limit);

      return {
        items,
        hasMore: offset + limit < currentInputs.length,
        total: currentInputs.length,
        offset,
        limit,
      };
    },

    async searchTags(params: SearchTagsParams): Promise<Tag[]> {
      await delay();
      throwIfError();

      const query = params.query.toLowerCase();
      const limit = params.limit ?? 5;

      return currentTags
        .filter((t) => t.name.toLowerCase().includes(query))
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, limit);
    },

    async getAllTags(): Promise<Tag[]> {
      await delay();
      throwIfError();

      return currentTags.sort((a, b) => b.usageCount - a.usageCount);
    },

    async transaction<T>(fn: (repo: InboxRepository) => Promise<T>): Promise<T> {
      return fn(this);
    },
  };
}
