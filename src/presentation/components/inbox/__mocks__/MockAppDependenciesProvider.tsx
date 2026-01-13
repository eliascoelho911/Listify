/**
 * MockAppDependenciesProvider
 *
 * Provides a mock AppDependencies context for Storybook stories.
 * Allows testing components that depend on useInboxRepository and useInboxUseCases.
 *
 * Uses the same context as the real AppDependenciesProvider, so components
 * work without modification.
 */

import React, { type ReactElement, type ReactNode } from 'react';

import { AppDependenciesContext } from '@app/di/AppDependenciesProvider';
import type { AppDependencies, InboxUseCases } from '@app/di/types';
import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';

import { createMockInboxRepository, type MockInboxRepositoryOptions } from './MockInboxRepository';

export type MockAppDependenciesProviderProps = {
  children: ReactNode;
  /** Custom repository instance (optional - uses default mock if not provided) */
  repository?: InboxRepository;
  /** Options for creating the mock repository */
  repositoryOptions?: MockInboxRepositoryOptions;
};

/**
 * Creates mock InboxUseCases that delegate to the repository.
 */
function createMockInboxUseCases(repository: InboxRepository): InboxUseCases {
  return {
    createUserInput: async (input) => repository.createUserInput(input),
    updateUserInput: async (id, text) => repository.updateUserInput({ id, text }),
    deleteUserInput: async (id) => repository.deleteUserInput(id),
    getUserInputs: async (page = 0, limit = 20) => repository.getUserInputs({ page, limit }),
    searchTags: async (input) => repository.searchTags(input),
  };
}

/**
 * Provider for mock dependencies in Storybook stories.
 *
 * Usage:
 * ```tsx
 * <MockAppDependenciesProvider>
 *   <YourComponent />
 * </MockAppDependenciesProvider>
 * ```
 *
 * Or with custom options:
 * ```tsx
 * <MockAppDependenciesProvider
 *   repositoryOptions={{ initialInputs: customInputs, loadingDelay: 500 }}
 * >
 *   <YourComponent />
 * </MockAppDependenciesProvider>
 * ```
 */
export function MockAppDependenciesProvider({
  children,
  repository,
  repositoryOptions,
}: MockAppDependenciesProviderProps): ReactElement {
  const inboxRepository = repository ?? createMockInboxRepository(repositoryOptions);
  const inboxUseCases = createMockInboxUseCases(inboxRepository);

  // Create minimal mock dependencies
  // Only inbox-related fields are properly mocked, others are stubs
  const mockDependencies: AppDependencies = {
    database: {} as AppDependencies['database'],
    drizzleDb: {} as AppDependencies['drizzleDb'],
    shoppingRepository: {} as AppDependencies['shoppingRepository'],
    shoppingUseCases: {} as AppDependencies['shoppingUseCases'],
    inboxRepository,
    inboxUseCases,
  };

  return (
    <AppDependenciesContext.Provider value={mockDependencies}>
      {children}
    </AppDependenciesContext.Provider>
  );
}
