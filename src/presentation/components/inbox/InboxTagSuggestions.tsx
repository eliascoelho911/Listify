/**
 * InboxTagSuggestions Component
 *
 * Displays tag suggestions above the input bar.
 */

import React, { type ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { Hash } from 'lucide-react-native';

import { Text } from '@design-system/atoms';
import type { SuggestionItem } from '@design-system/molecules';
import { SuggestionsPopUp } from '@design-system/molecules';
import { useTheme } from '@design-system/theme';

import { useInboxVM } from '../../hooks/useInboxVM';

export function InboxTagSuggestions(): ReactElement | null {
  const { theme } = useTheme();
  const vm = useInboxVM();

  const styles = createStyles(theme);

  const suggestionItems: SuggestionItem[] = vm.tagSuggestions.map((tag) => ({
    id: tag.id,
    label: `#${tag.name}`,
    description: `${tag.usageCount} uses`,
  }));

  const handleSelect = (item: SuggestionItem) => {
    const tag = vm.tagSuggestions.find((t) => t.id === item.id);
    if (tag) {
      vm.handleSelectTag(tag);
    }
  };

  const renderItem = (item: SuggestionItem): ReactElement => (
    <View style={styles.itemContainer}>
      <Hash size={16} color={theme.colors.primary} />
      <Text style={styles.itemLabel}>{item.label.replace('#', '')}</Text>
      {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
    </View>
  );

  return (
    <SuggestionsPopUp
      items={suggestionItems}
      onSelect={handleSelect}
      visible={suggestionItems.length > 0 || vm.isLoadingTags}
      isLoading={vm.isLoadingTags}
      emptyMessage="No matching tags"
      renderItem={renderItem}
      maxItems={5}
    />
  );
}

const createStyles = (theme: typeof import('@design-system/theme/theme').darkTheme) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    itemLabel: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      color: theme.colors.foreground,
    },
    itemDescription: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
      marginLeft: 'auto',
    },
  });
