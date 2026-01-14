/**
 * InboxScreen
 *
 * Main screen for the inbox feature.
 * Displays user inputs grouped by date with sticky headers.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { Menu } from 'lucide-react-native';

import type { UserInput } from '@domain/inbox/entities';
import type { DateGroup } from '@domain/inbox/entities/types';
import { DateBadge, Logo, Text } from '@design-system/atoms';
import { SearchBar } from '@design-system/molecules';
import { Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

import { DeleteConfirmDialog } from '../components/inbox/DeleteConfirmDialog';
import { InboxBottomBar } from '../components/inbox/InboxBottomBar';
import { InputOptionsMenu } from '../components/inbox/InputOptionsMenu';
import { UserInputCard } from '../components/inbox/UserInputCard';
import { useInboxVM } from '../hooks/useInboxVM';
import { InboxUIStoreProvider } from '../state/inbox/InboxUIStoreProvider';

type ListItem = { type: 'header'; group: DateGroup } | { type: 'input'; input: UserInput };

function InboxScreenContent(): ReactElement {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const vm = useInboxVM();

  const handleOpenDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const [selectedInput, setSelectedInput] = useState<UserInput | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // FIXME: https://github.com/facebook/react-native/issues/52596
  const [keyboardBehavior, setKeyboardBehavior] = useState<'padding' | undefined>('padding');

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardBehavior('padding');
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardBehavior(undefined);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const styles = createStyles(theme);

  // Error banner for displaying errors
  const errorBanner = useMemo(() => {
    if (!vm.lastError) {
      return null;
    }
    return (
      <View style={styles.errorBanner}>
        <Text style={styles.errorText}>{t('inbox.errors.generic')}</Text>
        <Text style={styles.errorDismiss} onPress={vm.handleClearError}>
          {t('inbox.errors.dismiss')}
        </Text>
      </View>
    );
  }, [vm.lastError, vm.handleClearError, t, styles]);

  // Flatten grouped data for FlashList
  const listData = useMemo((): ListItem[] => {
    const items: ListItem[] = [];

    for (const group of vm.groupedInputs) {
      items.push({ type: 'header', group });
      for (const input of group.inputs) {
        items.push({ type: 'input', input });
      }
    }

    return items;
  }, [vm.groupedInputs]);

  const handleLongPress = useCallback((input: UserInput) => {
    setSelectedInput(input);
    setMenuVisible(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const handleEdit = useCallback(
    (input: UserInput) => {
      setMenuVisible(false);
      vm.handleStartEditing(input);
    },
    [vm],
  );

  const handleDeleteRequest = useCallback((input: UserInput) => {
    setMenuVisible(false);
    setSelectedInput(input);
    setDeleteDialogVisible(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedInput) return;

    setIsDeleting(true);
    try {
      await vm.handleDelete(selectedInput.id);
      setDeleteDialogVisible(false);
      setSelectedInput(null);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedInput, vm]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogVisible(false);
    setSelectedInput(null);
  }, []);

  const renderEmptyState = (): ReactElement => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{t('inbox.list.empty.title')}</Text>
      <Text style={styles.emptySubtitle}>{t('inbox.list.empty.subtitle')}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: ListItem }): ReactElement => {
    if (item.type === 'header') {
      return (
        <View style={styles.stickyHeader}>
          <DateBadge label={item.group.label} variant={item.group.variant} />
        </View>
      );
    }

    return <UserInputCard input={item.input} onLongPress={() => handleLongPress(item.input)} />;
  };

  const stickyHeaderIndices = useMemo(() => {
    return listData
      .map((item, index) => (item.type === 'header' ? index : -1))
      .filter((index) => index !== -1);
  }, [listData]);

  const getItemType = (item: ListItem): string => item.type;

  const renderFooter = useCallback((): ReactElement | null => {
    if (!vm.hasMore) {
      return null;
    }

    if (vm.isLoadingMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      );
    }

    return null;
  }, [vm.hasMore, vm.isLoadingMore, styles, theme]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={keyboardBehavior}>
        <Navbar
          leftAction={{
            icon: Menu,
            onPress: handleOpenDrawer,
            label: t('inbox.header.menu'),
          }}
          titleContent={<Logo size="md" />}
          animated={false}
        />

        <View style={styles.searchContainer}>
          <SearchBar
            value=""
            onChangeText={() => {}}
            placeholder={t('inbox.search.placeholder')}
            editable={false}
          />
        </View>

        {errorBanner}

        <View style={styles.listContainer}>
          {listData.length === 0 && !vm.isLoading ? (
            renderEmptyState()
          ) : (
            <FlashList
              data={listData}
              keyExtractor={(item) =>
                item.type === 'header'
                  ? `header-${item.group.date.toISOString()}`
                  : `input-${item.input.id}`
              }
              renderItem={renderItem}
              getItemType={getItemType}
              contentContainerStyle={styles.listContent}
              stickyHeaderIndices={stickyHeaderIndices}
              stickyHeaderConfig={{ hideRelatedCell: true }}
              onEndReached={vm.handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              maintainVisibleContentPosition={{
                startRenderingFromBottom: true,
              }}
            />
          )}
        </View>

        <InboxBottomBar />
      </KeyboardAvoidingView>

      <InputOptionsMenu
        input={selectedInput}
        visible={menuVisible}
        onClose={handleMenuClose}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <DeleteConfirmDialog
        visible={deleteDialogVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />
    </SafeAreaView>
  );
}

export function InboxScreen(): ReactElement {
  return (
    <InboxUIStoreProvider>
      <InboxScreenContent />
    </InboxUIStoreProvider>
  );
}

const createStyles = (theme: typeof import('@design-system/theme/theme').darkTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    listContent: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    stickyHeader: {
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.transparent,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    emptyTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold as '600',
      fontFamily: theme.typography.families.body,
      color: theme.colors.foreground,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
      textAlign: 'center',
    },
    errorBanner: {
      backgroundColor: theme.colors.destructive,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    errorText: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.destructiveForeground,
      flex: 1,
    },
    errorDismiss: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.destructiveForeground,
      fontWeight: theme.typography.weights.semibold as '600',
      marginLeft: theme.spacing.sm,
    },
    loadingFooter: {
      paddingVertical: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
