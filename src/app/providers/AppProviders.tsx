import type { ReactElement, ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { buildDependencies } from '@app/di/container';
import type { AppDependencies } from '@app/di/types';
import { i18n, initializeI18n } from '@app/i18n/i18n';

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
  const [bootstrapError, setBootstrapError] = useState<Error | null>(null);
  const [isI18nReady, setIsI18nReady] = useState<boolean>(i18n.isInitialized);

  useEffect(() => {
    let isMounted = true;
    initializeI18n()
      .then(() => {
        if (isMounted) {
          setIsI18nReady(true);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setBootstrapError(err instanceof Error ? err : new Error('Failed to initialize i18n.'));
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
          setBootstrapError(err instanceof Error ? err : new Error('Failed to start app.'));
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isI18nReady) {
    return (
      <BootstrapScreen
        showSpinner={!bootstrapError}
        title="Starting up"
        subtitle={bootstrapError ? 'Failed to start the app.' : 'Loading translations...'}
        hint={bootstrapError ? 'Try reopening the app or clearing local storage.' : undefined}
      />
    );
  }

  const content = bootstrapError ? (
    <BootstrapErrorScreen />
  ) : !deps ? (
    <BootstrapLoadingScreen />
  ) : (
    <DependenciesContext.Provider value={deps}>{children}</DependenciesContext.Provider>
  );

  return <I18nextProvider i18n={i18n}>{content}</I18nextProvider>;
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

type BootstrapScreenProps = {
  title: string;
  subtitle?: string;
  hint?: string;
  showSpinner?: boolean;
};

function BootstrapScreen({
  title,
  subtitle,
  hint,
  showSpinner = false,
}: BootstrapScreenProps): ReactElement {
  return (
    <SafeAreaView style={styles.fullscreen}>
      <View style={styles.centered}>
        {showSpinner ? <ActivityIndicator size="large" color="#111827" /> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

function BootstrapLoadingScreen(): ReactElement {
  const { t } = useTranslation();
  return (
    <BootstrapScreen showSpinner title={t('loading.title')} subtitle={t('loading.subtitle')} />
  );
}

function BootstrapErrorScreen(): ReactElement {
  const { t } = useTranslation();
  return (
    <BootstrapScreen
      title={t('errors.bootstrapFailed.title')}
      subtitle={t('errors.bootstrapFailed.message')}
      hint={t('errors.bootstrapFailed.hint')}
    />
  );
}
