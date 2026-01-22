/**
 * Hook to use the section store with dependency injection
 *
 * Provides access to the section store with automatic DI integration.
 * Creates a stable store instance using repositories from the DI container.
 */

import { useMemo } from 'react';

import { useAppDependencies } from '@app/di';
import {
  createSectionStore,
  type SectionStoreInstance,
} from '@presentation/stores/useSectionStore';

/**
 * Hook that creates and returns a section store connected to DI repositories.
 *
 * The store instance is memoized based on the repository references,
 * so it will only be recreated if the DI container changes.
 *
 * @returns The section store instance with all actions and state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const sectionStore = useSectionStoreWithDI();
 *
 *   // Subscribe to state changes
 *   const { sectionsByListId, loadSections } = sectionStore();
 *
 *   // Or use selectors
 *   const sections = sectionStore(state => state.sectionsByListId[listId]);
 * }
 * ```
 */
export function useSectionStoreWithDI(): SectionStoreInstance {
  const { sectionRepository } = useAppDependencies();

  const store = useMemo(() => createSectionStore({ sectionRepository }), [sectionRepository]);

  return store;
}
