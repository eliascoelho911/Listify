/**
 * Hook to use the section store with dependency injection
 */

import { useMemo } from 'react';

import { useAppDependencies } from '@app/di';
import {
  createSectionStore,
  type SectionStoreInstance,
} from '@presentation/stores/useSectionStore';

/**
 * Returns a function that creates/returns the section store with injected dependencies.
 * The store is memoized per repository instance.
 */
export function useSectionStoreWithDI(): () => SectionStoreInstance {
  const { sectionRepository } = useAppDependencies();

  const storeFactory = useMemo(() => {
    let store: SectionStoreInstance | null = null;

    return () => {
      if (!store) {
        store = createSectionStore({ sectionRepository });
      }
      return store;
    };
  }, [sectionRepository]);

  return storeFactory;
}
