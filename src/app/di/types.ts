import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

/**
 * Type for the Drizzle database instance.
 * Used internally by the DI container for live queries.
 */
const schema = {}; // Placeholder for actual schema, replace with real schema when available
export type DrizzleDB = ExpoSQLiteDatabase<typeof schema>;

export type AppDependencies = {};

export type BuildDependenciesOptions = {
  databaseName?: string;
};
