import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { theme } from '@legacy-design-system/theme/theme';

import type { MonetarySummary, SummaryCounts } from '@domain/shopping/use-cases/ComputeListSummary';
import { formatMoney } from '@presentation/utils/price';
import { Text } from '@design-system/atoms';

type ListSummaryHeaderProps = {
  totals: SummaryCounts;
  monetaryTotals?: MonetarySummary;
  locale: string;
};

export function ListSummaryHeader({
  totals,
  monetaryTotals,
  locale,
}: ListSummaryHeaderProps): ReactElement {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('shoppingList.summary.title')}</Text>
      <View style={styles.row}>
        <CountPill label={t('shoppingList.summary.total')} value={totals.totalItems} />
        <CountPill label={t('shoppingList.summary.pending')} value={totals.pendingItems} />
        <CountPill label={t('shoppingList.summary.purchased')} value={totals.purchasedItems} />
      </View>

      {monetaryTotals ? (
        <View style={styles.values}>
          <MoneyPill
            label={t('shoppingList.summary.estimated')}
            value={monetaryTotals.totalEstimatedPendingMinor}
            locale={locale}
            currencyCode={monetaryTotals.currencyCode}
          />
          <MoneyPill
            label={t('shoppingList.summary.spent')}
            value={monetaryTotals.totalSpentMinor}
            locale={locale}
            currencyCode={monetaryTotals.currencyCode}
          />
          <MoneyPill
            label={t('shoppingList.summary.planned')}
            value={monetaryTotals.totalPlannedMinor}
            locale={locale}
            currencyCode={monetaryTotals.currencyCode}
          />
        </View>
      ) : null}
    </View>
  );
}

type PillProps = {
  label: string;
  value: number;
};

function CountPill({ label, value }: PillProps): ReactElement {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillValue}>{value}</Text>
    </View>
  );
}

type MoneyPillProps = PillProps & {
  locale: string;
  currencyCode: string;
};

function MoneyPill({ label, value, currencyCode, locale }: MoneyPillProps): ReactElement {
  return (
    <View style={[styles.pill, styles.moneyPill]}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.moneyValue}>{formatMoney(value, currencyCode, locale)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.card,
  },
  title: {
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.lg,
    lineHeight: theme.typography.sizes.lg * theme.typography.lineHeights.normal,
    color: theme.colors.content.primary,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  values: {
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
  moneyPill: {
    backgroundColor: theme.colors.background.raised,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
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
  moneyValue: {
    fontFamily: theme.typography.families.heading,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.content.primary,
  },
});
