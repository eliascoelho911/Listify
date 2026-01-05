import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@design-system/theme/theme';

export default function ShoppingListScreen(): ReactElement {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('screens.home.title')}</Text>
        <Text style={styles.subtitle}>{t('screens.home.subtitle')}</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('screens.home.cardTitle')}</Text>
          <Text style={styles.cardText}>{t('screens.home.cardText')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.canvas,
  },
  content: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.families.heading,
    fontSize: theme.typography.sizes.display,
    lineHeight: theme.typography.sizes.display * theme.typography.lineHeights.tight,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.content.primary,
  },
  subtitle: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.relaxed,
    color: theme.colors.content.secondary,
  },
  card: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
    ...theme.shadows.card,
  },
  cardTitle: {
    fontFamily: theme.typography.families.heading,
    fontSize: theme.typography.sizes.lg,
    lineHeight: theme.typography.sizes.lg * theme.typography.lineHeights.normal,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.content.primary,
  },
  cardText: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.relaxed,
    color: theme.colors.content.muted,
  },
});
