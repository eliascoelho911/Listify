import React, {
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useMemo,
} from 'react';

import { buildDependenciesSync } from './container';
import { useDatabase } from './DatabaseProvider';
import type { AppDependencies } from './types';

export const AppDependenciesContext = createContext<AppDependencies | null>(null);

type AppDependenciesProviderProps = {
  children: ReactNode;
};

/**
 * Provider global para centralizar injeção de dependências.
 *
 * Requer que DatabaseProvider esteja acima na árvore de componentes,
 * pois usa useDatabase() para obter a instância do banco de dados.
 */
export function AppDependenciesProvider({ children }: AppDependenciesProviderProps): ReactElement {
  const db = useDatabase();
  const dependencies = useMemo(() => buildDependenciesSync(db), [db]);

  return (
    <AppDependenciesContext.Provider value={dependencies}>
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
