import { createContext, type ReactElement, type ReactNode, useContext, useMemo } from 'react';
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import * as schema from './schema';

export type DrizzleDB = ExpoSQLiteDatabase<typeof schema>;

type DrizzleContextValue = {
  db: DrizzleDB;
  rawDb: SQLiteDatabase;
};

const DrizzleContext = createContext<DrizzleContextValue | null>(null);

type DrizzleProviderProps = {
  children: ReactNode;
  databaseName?: string;
};

/**
 * Provides Drizzle ORM database access with reactive query support.
 *
 * IMPORTANT: enableChangeListener must be true for useLiveQuery to work.
 * This provider should be placed high in the component tree, after
 * AppDependenciesProvider to ensure migrations have been applied.
 */
export function DrizzleProvider({
  children,
  databaseName = 'listify.db',
}: DrizzleProviderProps): ReactElement {
  const contextValue = useMemo(() => {
    const rawDb = openDatabaseSync(databaseName, {
      enableChangeListener: true,
    });

    rawDb.execSync('PRAGMA foreign_keys = ON;');

    const db = drizzle(rawDb, { schema });

    return { db, rawDb };
  }, [databaseName]);

  return <DrizzleContext.Provider value={contextValue}>{children}</DrizzleContext.Provider>;
}

/**
 * Hook to access the Drizzle database instance.
 *
 * @throws Error if used outside of DrizzleProvider
 */
export function useDrizzle(): DrizzleDB {
  const context = useContext(DrizzleContext);
  if (!context) {
    throw new Error('useDrizzle must be used within a DrizzleProvider');
  }
  return context.db;
}

/**
 * Hook to access the raw expo-sqlite database instance.
 * Use this only when you need direct access to SQLite features
 * not exposed by Drizzle.
 *
 * @throws Error if used outside of DrizzleProvider
 */
export function useRawDatabase(): SQLiteDatabase {
  const context = useContext(DrizzleContext);
  if (!context) {
    throw new Error('useRawDatabase must be used within a DrizzleProvider');
  }
  return context.rawDb;
}
