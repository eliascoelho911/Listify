import { type ReactElement, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { seedInbox } from '@app/debug/seedInbox';
import { useAppDependencies } from '@app/di/AppDependenciesProvider';
import { Button, Text } from '@design-system/atoms';
import { useTheme } from '@design-system/theme';

export default function DebugRoute(): ReactElement {
  const { theme } = useTheme();
  const { drizzleDb } = useAppDependencies();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const runSeed = async (options: {
    days: number;
    count?: number;
    min?: number;
    max?: number;
    clear?: boolean;
    tags?: boolean;
  }) => {
    setLoading(true);
    setProgress([]);
    setResult(null);

    try {
      const fullOptions = {
        days: options.days,
        count: options.count,
        min: options.min ?? 5,
        max: options.max ?? 10,
        clear: options.clear ?? true,
        tags: options.tags ?? true,
      };

      const { totalRecords, uniqueTags, timeMs } = await seedInbox(
        drizzleDb,
        fullOptions,
        (message: string) => {
          setProgress((prev) => [...prev, message]);
        },
      );

      setResult(
        `✅ Seed concluído!\n\n` +
          `Total de registros: ${totalRecords}\n` +
          `Tags únicas: ${uniqueTags}\n` +
          `Tempo: ${(timeMs / 1000).toFixed(1)}s`,
      );
    } catch (error) {
      setResult(
        `❌ Erro ao executar seed:\n\n${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold as '700',
      fontFamily: theme.typography.families.body,
      color: theme.colors.foreground,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.semibold as '600',
      fontFamily: theme.typography.families.body,
      color: theme.colors.foreground,
      marginBottom: theme.spacing.md,
    },
    buttonRow: {
      flexDirection: 'row' as const,
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    buttonWrapper: {
      flex: 1,
    },
    progressContainer: {
      backgroundColor: theme.colors.muted,
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
      maxHeight: 200,
    },
    progressText: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.mono,
      color: theme.colors.mutedForeground,
      marginBottom: theme.spacing.xs,
    },
    resultContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    resultText: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.mono,
      color: theme.colors.foreground,
      lineHeight: 20,
    },
    loadingContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Debug Tools</Text>
          <Text style={styles.subtitle}>
            Ferramentas de debug disponíveis apenas em modo de desenvolvimento
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seed Inbox</Text>

          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button onPress={() => runSeed({ days: 7 })} disabled={loading}>
                7 dias (5-10/dia)
              </Button>
            </View>
            <View style={styles.buttonWrapper}>
              <Button onPress={() => runSeed({ days: 14, count: 8 })} disabled={loading}>
                14 dias (8/dia)
              </Button>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button onPress={() => runSeed({ days: 30, min: 3, max: 7 })} disabled={loading}>
                30 dias (3-7/dia)
              </Button>
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                onPress={() => runSeed({ days: 2, count: 2, clear: false })}
                disabled={loading}
                variant="outline"
              >
                2 dias (sem limpar)
              </Button>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button
                onPress={() => runSeed({ days: 7, tags: false })}
                disabled={loading}
                variant="outline"
              >
                7 dias (sem tags)
              </Button>
            </View>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.subtitle}>Executando seed...</Text>
          </View>
        )}

        {progress.length > 0 && (
          <ScrollView style={styles.progressContainer}>
            {progress.map((msg, idx) => (
              <Text key={idx} style={styles.progressText}>
                {msg}
              </Text>
            ))}
          </ScrollView>
        )}

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
