import type { ReactElement, ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { buildDependencies } from '@app/di/container';
import type { AppDependencies } from '@app/di/types';

const DependenciesContext = createContext<AppDependencies | null>(null);

export function useDependencies(): AppDependencies {
  const context = useContext(DependenciesContext);
  if (!context) {
    throw new Error('Dependências do app ainda não foram carregadas.');
  }
  return context;
}

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps): ReactElement {
  const [deps, setDeps] = useState<AppDependencies | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    buildDependencies()
      .then((built) => {
        if (isMounted) {
          setDeps(built);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.fullscreen}>
        <View style={styles.centered}>
          <Text style={styles.title}>Falha ao iniciar</Text>
          <Text style={styles.subtitle}>Não conseguimos abrir a base local.</Text>
          <Text style={styles.hint}>Tente reabrir o app ou limpar o armazenamento.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!deps) {
    return (
      <SafeAreaView style={styles.fullscreen}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.subtitle}>Inicializando Listify...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return <DependenciesContext.Provider value={deps}>{children}</DependenciesContext.Provider>;
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
