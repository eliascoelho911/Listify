import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { SnackBar } from '@design-system/components/SnackBar';
import { theme } from '@design-system/theme/theme';

import { AddItemInput } from '../components/AddItemInput';
import { CategorySection } from '../components/CategorySection';
import { useShoppingListVM } from '../hooks/useShoppingListVM';

export default function ShoppingListScreen(): ReactElement {
  const { t } = useTranslation();
  const router = useRouter();
  const { state, actions } = useShoppingListVM();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    await actions.refresh();
    setIsRefreshing(false);
  };

  const errorBanner = useMemo(() => {
    if (!state.lastError) {
      return null;
    }
    const messageKey =
      state.lastError.type === 'load' ? 'shoppingList.errors.load' : 'shoppingList.errors.write';
    return (
      <View style={styles.errorBanner}>
        <Text style={styles.errorTitle}>{t(messageKey)}</Text>
        {state.lastError.message ? (
          <Text style={styles.errorSubtitle}>{state.lastError.message}</Text>
        ) : null}
      </View>
    );
  }, [state.lastError, t]);

  const hasItems = state.categories.some(
    (category) => category.items.pending.length + category.items.purchased.length > 0,
  );

  const emptyState = (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{t('shoppingList.empty.title')}</Text>
      <Text style={styles.emptySubtitle}>{t('shoppingList.empty.subtitle')}</Text>
    </View>
  );

  // FIXME: https://github.com/facebook/react-native/issues/52596
  const [behaviour, setBehaviour] = useState<'padding' | undefined>('padding');

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setBehaviour('padding');
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setBehaviour(undefined);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={behaviour}
        keyboardVerticalOffset={insets.bottom}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.brand[600]}
            />
          }
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t('screens.home.title')}</Text>
            <Text style={styles.subtitle}>{t('screens.home.subtitle')}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{t('shoppingList.summary.title')}</Text>
            <View style={styles.summaryRow}>
              <SummaryPill
                label={t('shoppingList.summary.total')}
                value={state.totals.totalItems}
              />
              <SummaryPill
                label={t('shoppingList.summary.pending')}
                value={state.totals.pendingItems}
              />
              <SummaryPill
                label={t('shoppingList.summary.purchased')}
                value={state.totals.purchasedItems}
              />
            </View>
          </View>

          {errorBanner}

          {state.isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={theme.colors.brand[600]} size="large" />
              <Text style={styles.loadingText}>{t('shoppingList.loading')}</Text>
            </View>
          ) : hasItems ? (
            state.categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                onToggleItem={actions.toggleItemStatus}
                onRemoveItem={actions.removeItem}
                onPressItem={(id) => router.push({ pathname: '/item/[id]', params: { id } })}
              />
            ))
          ) : (
            emptyState
          )}
        </ScrollView>

        {state.pendingUndo ? (
          <SnackBar
            message={t('shoppingList.undo.label', { name: state.pendingUndo.name })}
            actionLabel={t('shoppingList.undo.action')}
            onAction={actions.undoRemove}
            tone="info"
            style={styles.snackBar}
            onDismiss={actions.dismissUndo}
            closeLabel={t('shoppingList.undo.dismiss')}
            onClose={actions.dismissUndo}
          />
        ) : null}

        <View
          style={{
            paddingBottom: insets.bottom,
          }}
        >
          <AddItemInput
            value={state.inputText}
            preview={state.preview}
            isSubmitting={state.isSubmitting}
            onChangeText={actions.setInputText}
            onSubmit={actions.addItemFromInput}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

type SummaryPillProps = {
  label: string;
  value: number;
};

function SummaryPill({ label, value }: SummaryPillProps): ReactElement {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.canvas,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  header: {
    gap: theme.spacing.xs,
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
  summaryCard: {
    backgroundColor: theme.colors.background.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.card,
  },
  summaryTitle: {
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.lg,
    lineHeight: theme.typography.sizes.lg * theme.typography.lineHeights.normal,
    color: theme.colors.content.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  pill: {
    flex: 1,
    backgroundColor: theme.colors.background.muted,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.md,
    gap: theme.spacing.xxs,
  },
  pillLabel: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.content.muted,
  },
  pillValue: {
    fontFamily: theme.typography.families.heading,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.content.primary,
  },
  errorBanner: {
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.warning[50],
    borderWidth: 1,
    borderColor: theme.colors.warning[200],
    gap: theme.spacing.xxs,
  },
  errorTitle: {
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.warning[800],
  },
  errorSubtitle: {
    fontFamily: theme.typography.families.body,
    color: theme.colors.warning[700],
    fontSize: theme.typography.sizes.sm,
  },
  loading: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
  },
  loadingText: {
    fontFamily: theme.typography.families.body,
    color: theme.colors.content.secondary,
  },
  emptyState: {
    padding: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  emptyTitle: {
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.content.primary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.content.secondary,
    textAlign: 'center',
  },
  snackBar: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
});
