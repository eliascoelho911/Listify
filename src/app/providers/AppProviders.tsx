import type { ReactElement, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { buildDependencies } from '@app/di/container';
import type { AppDependencies, BuildDependenciesOptions } from '@app/di/types';
import { DEFAULT_DATABASE_NAME, SqliteDatabase } from '@infra/storage/sqlite/SqliteDatabase';
import { theme } from '@design-system/theme/theme';

import { i18n, initializeI18n } from '../i18n/i18n';

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
  const [reloadToken, setReloadToken] = useState(0);
  const [deps, setDeps] = useState<AppDependencies | null>(null);
  const [bootstrapError, setBootstrapError] = useState<Error | null>(null);
  const [isI18nReady, setIsI18nReady] = useState<boolean>(i18n.isInitialized);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const buildOptions = useMemo<BuildDependenciesOptions>(() => ({}), []);
  const databaseName = buildOptions.databaseName ?? DEFAULT_DATABASE_NAME;

  useEffect(() => {
    let isMounted = true;
    if (i18n.isInitialized) {
      return;
    }

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
      })
      .finally(() => {
        if (isMounted && !i18n.isInitialized) {
          setIsI18nReady(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [reloadToken]);

  useEffect(() => {
    let isMounted = true;
    if (!isI18nReady) {
      return () => {
        isMounted = false;
      };
    }

    setBootstrapError(null);
    setDeps(null);
    buildDependencies(buildOptions)
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
  }, [isI18nReady, reloadToken, buildOptions]);

  const handleRetry = (): void => {
    setBootstrapError(null);
    setReloadToken((token) => token + 1);
  };

  const handleReset = (): void => {
    Alert.alert(
      i18n.t('recovery.reset.title'),
      i18n.t('recovery.reset.message'),
      [
        {
          text: i18n.t('recovery.reset.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('recovery.reset.confirm'),
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await SqliteDatabase.resetDatabase(databaseName);
              setBootstrapError(null);
              setReloadToken((token) => token + 1);
            } catch (error) {
              setBootstrapError(
                error instanceof Error ? error : new Error('Failed to reset local data.'),
              );
            } finally {
              setIsResetting(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const content = (() => {
    if (bootstrapError) {
      return (
        <RecoveryScreen isResetting={isResetting} onReset={handleReset} onRetry={handleRetry} />
      );
    }

    if (!isI18nReady || !deps) {
      return <BootstrapLoadingScreen showSpinner={!bootstrapError} />;
    }

    return <DependenciesContext.Provider value={deps}>{children}</DependenciesContext.Provider>;
  })();

  return <I18nextProvider i18n={i18n}>{content}</I18nextProvider>;
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: theme.colors.background.canvas,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.families.heading,
    fontSize: theme.typography.sizes.xl,
    lineHeight: theme.typography.sizes.xl * theme.typography.lineHeights.tight,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.content.primary,
  },
  subtitle: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.normal,
    color: theme.colors.content.secondary,
    textAlign: 'center',
  },
  hint: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.relaxed,
    color: theme.colors.content.muted,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  button: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.brand[700],
  },
  buttonSecondary: {
    backgroundColor: theme.colors.background.muted,
  },
  buttonText: {
    fontFamily: theme.typography.families.heading,
    color: theme.colors.content.inverse,
    fontWeight: theme.typography.weights.semibold,
  },
  buttonTextSecondary: {
    color: theme.colors.content.primary,
  },
});

type BootstrapScreenProps = {
  title: string;
  subtitle: string;
  hint?: string;
  showSpinner?: boolean;
  children?: ReactNode;
};

function BootstrapScreen({
  title,
  subtitle,
  hint,
  showSpinner = false,
  children,
}: BootstrapScreenProps): ReactElement {
  return (
    <SafeAreaView style={styles.fullscreen}>
      <View style={styles.centered}>
        {showSpinner ? <ActivityIndicator size="large" color={theme.colors.brand[600]} /> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        {children}
      </View>
    </SafeAreaView>
  );
}

type BootstrapLoadingScreenProps = {
  showSpinner?: boolean;
};

function BootstrapLoadingScreen({ showSpinner = true }: BootstrapLoadingScreenProps): ReactElement {
  const { t } = useTranslation();
  return (
    <BootstrapScreen
      showSpinner={showSpinner}
      title={t('loading.title')}
      subtitle={t('loading.subtitle')}
      hint={t('loading.hint')}
    />
  );
}

type RecoveryScreenProps = {
  onRetry: () => void;
  onReset: () => void;
  isResetting: boolean;
};

function RecoveryScreen({ onRetry, onReset, isResetting }: RecoveryScreenProps): ReactElement {
  const { t } = useTranslation();
  return (
    <BootstrapScreen
      title={t('recovery.title')}
      subtitle={t('recovery.subtitle')}
      hint={t('recovery.hint')}
      showSpinner={isResetting}
    >
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={[styles.button, styles.buttonSecondary]}
          disabled={isResetting}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            {t('recovery.actions.retry')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onReset}
          style={styles.button}
          disabled={isResetting}
        >
          <Text style={styles.buttonText}>
            {isResetting ? t('recovery.actions.resetting') : t('recovery.actions.reset')}
          </Text>
        </Pressable>
      </View>
    </BootstrapScreen>
  );
}
