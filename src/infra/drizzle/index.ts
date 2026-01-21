import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import * as schema from './schema';

export * from './schema';

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

/**
 * Creates a Drizzle database instance.
 * Migrations are handled separately by DatabaseProvider using useMigrations hook.
 */
export function createDatabase(dbName = 'listify.db'): DrizzleDB {
  const expoDb = SQLite.openDatabaseSync(dbName);
  return drizzle(expoDb, { schema });
}

// Singleton instance for the app
let dbInstance: DrizzleDB | null = null;

/**
 * Gets or creates the database singleton.
 * Use this when you need access to the db outside of React components.
 */
export function getDatabase(dbName = 'listify.db'): DrizzleDB {
  if (!dbInstance) {
    dbInstance = createDatabase(dbName);
  }
  return dbInstance;
}

/**
 * Resets the database singleton (useful for testing).
 */
export function resetDatabaseInstance(): void {
  dbInstance = null;
}
