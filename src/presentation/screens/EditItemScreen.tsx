import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@design-system/theme/theme';

type EditItemScreenProps = {
  itemId?: string;
};

export default function EditItemScreen({ itemId }: EditItemScreenProps): ReactElement {
  const { t } = useTranslation();
  const displayedId = itemId ?? t('screens.editItem.missingId');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('screens.editItem.title')}</Text>
        <Text style={styles.subtitle}>{t('screens.editItem.selectedId', { id: displayedId })}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.canvas,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
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
  },
});
