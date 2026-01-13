/**
 * InboxDrizzleRepo - Drizzle ORM implementation of InboxRepository
 *
 * This class implements the InboxRepository interface using Drizzle ORM,
 * following Clean Architecture principles by keeping the infrastructure
 * implementation separate from the domain layer.
 */

import { desc, eq, sql } from 'drizzle-orm';

import { DrizzleDB } from '@app/di/types';
import type { PaginatedUserInputs, Tag, UserInput } from '@domain/inbox/entities';
import type {
  CreateUserInputParams,
  GetUserInputsParams,
  InboxRepository,
  SearchTagsParams,
  SubscribeToInputsOptions,
  UpdateUserInputParams,
} from '@domain/inbox/ports/InboxRepository';
import { UserInputNotFoundError } from '@domain/inbox/use-cases/errors';
import { extractTags } from '@domain/inbox/use-cases/extractTags';

import { inputTags, tags, userInputs } from './schema';

const DEFAULT_LIMIT = 20;

/**
 * Type for subscription callback.
 */
type SubscriptionCallback = (inputs: UserInput[]) => void;

/**
 * Maps raw database result to UserInput entity.
 */
export function mapRawToUserInput(raw: {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  inputTags: {
    tag: {
      id: string;
      name: string;
      usageCount: number;
      createdAt: string;
    };
  }[];
}): UserInput {
  return {
    id: raw.id,
    text: raw.text,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    tags: raw.inputTags.map((it) => ({
      id: it.tag.id,
      name: it.tag.name,
      usageCount: it.tag.usageCount,
      createdAt: new Date(it.tag.createdAt),
    })),
  };
}

/**
 * Generates a UUID v4 string.
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Drizzle ORM implementation of the InboxRepository interface.
 *
 * Handles all inbox-related database operations including:
 * - CRUD operations for UserInputs
 * - Tag management (create, search, usage tracking)
 * - Transactional operations
 * - Reactive subscriptions for data changes
 */
export class InboxDrizzleRepo implements InboxRepository {
  private subscribers: Map<SubscriptionCallback, { limit?: number }> = new Map();

  constructor(private db: DrizzleDB) {}

  /**
   * Notifies all subscribers with fresh data.
   * Called after any mutation (create, update, delete).
   */
  private async notifySubscribers(): Promise<void> {
    if (this.subscribers.size === 0) return;

    for (const [callback, options] of this.subscribers) {
      try {
        const results = await this.db.query.userInputs.findMany({
          with: {
            inputTags: {
              with: {
                tag: true,
              },
            },
          },
          orderBy: [desc(userInputs.updatedAt)],
          ...(options.limit !== undefined ? { limit: options.limit } : {}),
        });

        const inputs = results.map(mapRawToUserInput);
        callback(inputs);
      } catch {
        // Silently ignore errors in notification
      }
    }
  }

  subscribeToInputs(
    callback: SubscriptionCallback,
    options?: SubscribeToInputsOptions,
  ): () => void {
    this.subscribers.set(callback, { limit: options?.limit });

    // Emit initial data
    this.db.query.userInputs
      .findMany({
        with: {
          inputTags: {
            with: {
              tag: true,
            },
          },
        },
        orderBy: [desc(userInputs.updatedAt)],
        ...(options?.limit !== undefined ? { limit: options.limit } : {}),
      })
      .then((results) => {
        if (this.subscribers.has(callback)) {
          const inputs = results.map(mapRawToUserInput);
          callback(inputs);
        }
      })
      .catch(() => {
        // Silently ignore errors in initial fetch
      });

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  async createUserInput(params: CreateUserInputParams): Promise<UserInput> {
    const now = new Date();
    const inputId = generateId();
    const { tagNames } = extractTags({ text: params.text });

    const result = await this.db.transaction(async (tx) => {
      await tx.insert(userInputs).values({
        id: inputId,
        text: params.text,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });

      const resultTags: Tag[] = [];

      for (const tagName of tagNames) {
        const existing = await tx.query.tags.findFirst({
          where: eq(tags.name, tagName),
        });

        let tagId: string;
        let usageCount: number;
        let tagCreatedAt: Date;

        if (existing) {
          tagId = existing.id;
          usageCount = existing.usageCount + 1;
          tagCreatedAt = new Date(existing.createdAt);
          await tx.update(tags).set({ usageCount }).where(eq(tags.id, existing.id));
        } else {
          tagId = generateId();
          usageCount = 1;
          tagCreatedAt = now;
          await tx.insert(tags).values({
            id: tagId,
            name: tagName,
            usageCount: 1,
            createdAt: now.toISOString(),
          });
        }

        await tx.insert(inputTags).values({ inputId, tagId });

        resultTags.push({
          id: tagId,
          name: tagName,
          usageCount,
          createdAt: tagCreatedAt,
        });
      }

      return {
        id: inputId,
        text: params.text,
        createdAt: now,
        updatedAt: now,
        tags: resultTags,
      };
    });

    // Notify subscribers after successful mutation
    this.notifySubscribers();

    return result;
  }

  async updateUserInput(params: UpdateUserInputParams): Promise<UserInput> {
    const now = new Date();
    const newText = params.text ?? '';
    const { tagNames: newTagNames } = extractTags({ text: newText });

    const result = await this.db.transaction(async (tx) => {
      const existing = await tx.query.userInputs.findFirst({
        where: eq(userInputs.id, params.id),
      });

      if (!existing) {
        throw new UserInputNotFoundError(params.id);
      }

      await tx
        .update(userInputs)
        .set({ text: newText, updatedAt: now.toISOString() })
        .where(eq(userInputs.id, params.id));

      const currentInputTags = await tx.query.inputTags.findMany({
        where: eq(inputTags.inputId, params.id),
        with: { tag: true },
      });

      for (const it of currentInputTags) {
        await tx
          .update(tags)
          .set({ usageCount: it.tag.usageCount - 1 })
          .where(eq(tags.id, it.tagId));
      }

      await tx.delete(inputTags).where(eq(inputTags.inputId, params.id));

      const resultTags: Tag[] = [];

      for (const tagName of newTagNames) {
        const existingTag = await tx.query.tags.findFirst({
          where: eq(tags.name, tagName),
        });

        let tagId: string;
        let usageCount: number;
        let tagCreatedAt: Date;

        if (existingTag) {
          tagId = existingTag.id;
          usageCount = existingTag.usageCount + 1;
          tagCreatedAt = new Date(existingTag.createdAt);
          await tx.update(tags).set({ usageCount }).where(eq(tags.id, existingTag.id));
        } else {
          tagId = generateId();
          usageCount = 1;
          tagCreatedAt = now;
          await tx.insert(tags).values({
            id: tagId,
            name: tagName,
            usageCount: 1,
            createdAt: now.toISOString(),
          });
        }

        await tx.insert(inputTags).values({ inputId: params.id, tagId });

        resultTags.push({
          id: tagId,
          name: tagName,
          usageCount,
          createdAt: tagCreatedAt,
        });
      }

      return {
        id: params.id,
        text: newText,
        createdAt: new Date(existing.createdAt),
        updatedAt: now,
        tags: resultTags,
      };
    });

    // Notify subscribers after successful mutation
    this.notifySubscribers();

    return result;
  }

  async deleteUserInput(id: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      const existing = await tx.query.userInputs.findFirst({
        where: eq(userInputs.id, id),
      });

      if (!existing) {
        throw new UserInputNotFoundError(id);
      }

      const currentInputTags = await tx.query.inputTags.findMany({
        where: eq(inputTags.inputId, id),
        with: { tag: true },
      });

      for (const it of currentInputTags) {
        await tx
          .update(tags)
          .set({ usageCount: it.tag.usageCount - 1 })
          .where(eq(tags.id, it.tagId));
      }

      await tx.delete(userInputs).where(eq(userInputs.id, id));
    });

    // Notify subscribers after successful mutation
    this.notifySubscribers();
  }

  async getUserInputById(id: string): Promise<UserInput | null> {
    const result = await this.db.query.userInputs.findFirst({
      where: eq(userInputs.id, id),
      with: {
        inputTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      text: result.text,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
      tags: result.inputTags.map((it) => ({
        id: it.tag.id,
        name: it.tag.name,
        usageCount: it.tag.usageCount,
        createdAt: new Date(it.tag.createdAt),
      })),
    };
  }

  async getUserInputs(params: GetUserInputsParams): Promise<PaginatedUserInputs> {
    const limit = params.limit ?? DEFAULT_LIMIT;
    const offset = params.page * limit;

    const [results, totalResult] = await Promise.all([
      this.db.query.userInputs.findMany({
        with: {
          inputTags: {
            with: {
              tag: true,
            },
          },
        },
        orderBy: [desc(userInputs.createdAt)],
        limit: limit + 1,
        offset,
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(userInputs),
    ]);

    const total = totalResult[0]?.count ?? 0;
    const hasMore = results.length > limit;
    const items = results.slice(0, limit);

    return {
      items: items.map((result) => ({
        id: result.id,
        text: result.text,
        createdAt: new Date(result.createdAt),
        updatedAt: new Date(result.updatedAt),
        tags: result.inputTags.map((it) => ({
          id: it.tag.id,
          name: it.tag.name,
          usageCount: it.tag.usageCount,
          createdAt: new Date(it.tag.createdAt),
        })),
      })),
      hasMore,
      total,
      offset,
      limit,
    };
  }

  async searchTags(params: SearchTagsParams): Promise<Tag[]> {
    const normalizedQuery = params.query.toLowerCase().trim();
    const limit = params.limit ?? 10;

    if (!normalizedQuery) {
      return [];
    }

    const allTags = await this.db.query.tags.findMany();

    const matchingTags = allTags
      .filter((tag) => tag.name.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);

    return matchingTags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      usageCount: tag.usageCount,
      createdAt: new Date(tag.createdAt),
    }));
  }

  async getAllTags(): Promise<Tag[]> {
    const allTags = await this.db.query.tags.findMany({
      orderBy: [desc(tags.usageCount)],
    });

    return allTags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      usageCount: tag.usageCount,
      createdAt: new Date(tag.createdAt),
    }));
  }

  async transaction<T>(fn: (repo: InboxRepository) => Promise<T>): Promise<T> {
    return this.db.transaction(async (tx) => {
      const txRepo = new InboxDrizzleRepo(tx as unknown as DrizzleDB);
      return fn(txRepo);
    });
  }
}
