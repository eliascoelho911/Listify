import React, {
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';
import type { ShoppingRepository } from '@domain/shopping/ports/ShoppingRepository';

import { buildDependencies } from './container';
import type {
  AppDependencies,
  BuildDependenciesOptions,
  InboxUseCases,
  ShoppingUseCases,
} from './types';

type AppDependenciesState = {
  dependencies: AppDependencies | null;
  isLoading: boolean;
  error: Error | null;
};

const AppDependenciesContext = createContext<AppDependencies | null>(null);

type AppDependenciesProviderProps = {
  children: ReactNode;
  options?: BuildDependenciesOptions;
  fallback?: ReactNode;
  errorFallback?: (error: Error) => ReactNode;
};

/**
 * Provider global para centralizar injeção de dependências.
 *
 * Gerencia a inicialização assíncrona do banco de dados e repositories,
 * fornecendo loading state durante bootstrap e error handling.
 */
export function AppDependenciesProvider({
  children,
  options,
  fallback,
  errorFallback,
}: AppDependenciesProviderProps): ReactElement {
  const [state, setState] = useState<AppDependenciesState>({
    dependencies: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    buildDependencies(options)
      .then((deps) => {
        if (mounted) {
          setState({ dependencies: deps, isLoading: false, error: null });
        }
      })
      .catch((error: Error) => {
        if (mounted) {
          setState({ dependencies: null, isLoading: false, error });
        }
      });

    return () => {
      mounted = false;
    };
  }, [options]);

  if (state.isLoading) {
    return <>{fallback ?? null}</>;
  }

  if (state.error) {
    return <>{errorFallback?.(state.error) ?? null}</>;
  }

  return (
    <AppDependenciesContext.Provider value={state.dependencies}>
      {children}
    </AppDependenciesContext.Provider>
  );
}

/**
 * Hook para acessar todas as dependências da aplicação.
 *
 * @throws Error se usado fora do AppDependenciesProvider
 */
export function useAppDependencies(): AppDependencies {
  const context = useContext(AppDependenciesContext);
  if (!context) {
    throw new Error('useAppDependencies must be used within an AppDependenciesProvider');
  }
  return context;
}

/**
 * Hook para acessar o InboxRepository.
 *
 * @throws Error se usado fora do AppDependenciesProvider
 */
export function useInboxRepository(): InboxRepository {
  return useAppDependencies().inboxRepository;
}

/**
 * Hook para acessar o ShoppingRepository.
 *
 * @throws Error se usado fora do AppDependenciesProvider
 */
export function useShoppingRepository(): ShoppingRepository {
  return useAppDependencies().shoppingRepository;
}

/**
 * Hook para acessar os Inbox UseCases.
 *
 * @throws Error se usado fora do AppDependenciesProvider
 */
export function useInboxUseCases(): InboxUseCases {
  return useAppDependencies().inboxUseCases;
}

/**
 * Hook para acessar os Shopping UseCases.
 *
 * @throws Error se usado fora do AppDependenciesProvider
 */
export function useShoppingUseCases(): ShoppingUseCases {
  return useAppDependencies().shoppingUseCases;
}
