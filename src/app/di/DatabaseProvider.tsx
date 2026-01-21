import React, { createContext, type ReactElement, type ReactNode, useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import { Text } from '@design-system/atoms/Text/Text';
import { useTheme } from '@design-system/theme';
import { type DrizzleDB, getDatabase } from '@infra/drizzle';
import migrations from '@infra/drizzle/migrations/migrations';

type DatabaseContextValue = {
  db: DrizzleDB;
};

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

type DatabaseProviderProps = {
  children: ReactNode;
  databaseName?: string;
  loadingFallback?: ReactNode;
  errorFallback?: (error: Error) => ReactNode;
};

/**
 * Provider that initializes the database and runs migrations.
 * Children are only rendered after migrations complete successfully.
 */
export function DatabaseProvider({
  children,
  databaseName,
  loadingFallback,
  errorFallback,
}: DatabaseProviderProps): ReactElement {
  const { theme } = useTheme();
  const db = getDatabase(databaseName);
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    console.error('[DatabaseProvider] Migration error:', error);
    if (errorFallback) {
      return <>{errorFallback(error)}</>;
    }
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="h4" color="destructive">
          Database migration error
        </Text>
        <Text variant="bodySmall" color="mutedForeground" align="center">
          {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodySmall" color="mutedForeground" style={{ marginTop: theme.spacing.lg }}>
          Initializing database...
        </Text>
      </View>
    );
  }

  return <DatabaseContext.Provider value={{ db }}>{children}</DatabaseContext.Provider>;
}

/**
 * Hook to access the database instance.
 * Must be used within a DatabaseProvider.
 */
export function useDatabase(): DrizzleDB {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context.db;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
