/**
 * PurchaseHistoryScreen Presentation Component
 *
 * Displays the purchase history for a shopping list.
 * Shows a list of completed purchases with date, total, and item count.
 */

import React, { type ReactElement, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { usePurchaseHistoryStoreWithDI } from '@presentation/hooks';
import type { NavbarAction } from '@design-system/organisms';
import { HistoryList, Navbar } from '@design-system/organisms';
import type { HistoryEntry } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';
import type { Theme } from '@design-system/theme/theme';

const createStyles = (theme: Theme, topInset: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    navbarContainer: {
      paddingTop: topInset,
      backgroundColor: theme.colors.topbar,
    },
    content: {
      flex: 1,
    },
  });

export function PurchaseHistoryScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const styles = createStyles(theme, insets.top);

  const historyStore = usePurchaseHistoryStoreWithDI();
  const { entries, isLoading, loadByListId, clearEntries } = historyStore();

  useEffect(() => {
    if (listId) {
      loadByListId(listId);
    }

    return () => {
      clearEntries();
    };
  }, [listId, loadByListId, clearEntries]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEntryPress = useCallback(
    (entry: HistoryEntry) => {
      console.debug('[PurchaseHistoryScreen] Entry pressed:', entry.id);
      // Navigate to purchase detail screen if we implement it later
    },
    [],
  );

  const navbarActions: NavbarAction[] = [];

  const historyEntries: HistoryEntry[] = entries.map((entry) => ({
    id: entry.id,
    purchaseDate: entry.purchaseDate,
    totalValue: entry.totalValue,
    itemCount: entry.items.length,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.navbarContainer}>
        <Navbar
          title={t('history.title', 'Histórico')}
          variant="default"
          leftIcon={ArrowLeft}
          onLeftPress={handleBack}
          actions={navbarActions}
          testID="history-navbar"
        />
      </View>

      <View style={styles.content}>
        <HistoryList
          entries={historyEntries}
          onEntryPress={handleEntryPress}
          isLoading={isLoading}
          emptyTitle={t('history.empty.title', 'Nenhum histórico')}
          emptyDescription={t(
            'history.empty.description',
            'Suas compras concluídas aparecerão aqui',
          )}
          testID="history-list"
        />
      </View>
    </View>
  );
}
