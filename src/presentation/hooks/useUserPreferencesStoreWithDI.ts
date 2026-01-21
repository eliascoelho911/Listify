/**
 * useUserPreferencesStoreWithDI Hook
 *
 * Provides access to the user preferences store with automatic DI integration.
 * Creates a stable store instance using the repository from the DI container.
 */

import { useMemo } from 'react';

import { useAppDependencies } from '@app/di';

import {
  createUserPreferencesStore,
  type UserPreferencesStoreInstance,
} from '../stores/useUserPreferencesStore';

/**
 * Hook that creates and returns a user preferences store connected to DI repository.
 *
 * The store instance is memoized based on the repository reference,
 * so it will only be recreated if the DI container changes.
 *
 * @returns The user preferences store instance with all actions and state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const preferencesStore = useUserPreferencesStoreWithDI();
 *
 *   const handleThemeChange = async (theme: Theme) => {
 *     await preferencesStore.getState().setTheme(theme);
 *   };
 *
 *   // Subscribe to state changes
 *   const preferences = preferencesStore(state => state.preferences);
 * }
 * ```
 */
export function useUserPreferencesStoreWithDI(): UserPreferencesStoreInstance {
  const { userPreferencesRepository } = useAppDependencies();

  const store = useMemo(
    () =>
      createUserPreferencesStore({
        userPreferencesRepository,
      }),
    [userPreferencesRepository],
  );

  return store;
}
