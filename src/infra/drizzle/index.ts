import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import * as schema from './schema';

export * from './schema';

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

export function initializeDatabase(dbName = 'listify.db'): DrizzleDB {
  const expoDb = SQLite.openDatabaseSync(dbName);
  return drizzle(expoDb, { schema });
}
