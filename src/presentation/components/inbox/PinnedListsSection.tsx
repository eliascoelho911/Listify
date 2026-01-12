/**
 * PinnedListsSection Component
 *
 * Displays pinned lists section with empty state when no lists are pinned.
 */

import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Bookmark } from 'lucide-react-native';

import { Text } from '@design-system/atoms';
import { EmptyState } from '@design-system/molecules';
import { useTheme } from '@design-system/theme';

export function PinnedListsSection(): ReactElement {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // TODO: Replace with actual pinned lists data
  const hasPinnedLists = false;

  if (!hasPinnedLists) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{t('inbox.pinnedLists.title')}</Text>
        <View style={styles.emptyContainer}>
          <EmptyState icon={Bookmark} title={t('inbox.pinnedLists.empty')} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('inbox.pinnedLists.title')}</Text>
      {/* TODO: Render pinned lists here */}
    </View>
  );
}

const createStyles = (theme: typeof import('@design-system/theme/theme').darkTheme) =>
  StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold as '600',
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    emptyContainer: {
      height: 120,
    },
  });
