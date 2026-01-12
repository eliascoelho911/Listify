/**
 * SuggestionsPopUp Molecule Component
 *
 * Molecule inspirada no Command do Shadcn para exibir lista de sugestões acima de um input.
 * Pode ser usada para autocomplete de tags, comandos, etc.
 */

import React, { type ReactElement } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';

import { Text } from '../../atoms';
import { useTheme } from '../../theme';
import { createSuggestionsPopUpStyles } from './SuggestionsPopUp.styles';
import type { SuggestionItem, SuggestionsPopUpProps } from './SuggestionsPopUp.types';

export function SuggestionsPopUp<T extends SuggestionItem>({
  items,
  onSelect,
  visible,
  renderItem,
  emptyMessage = 'No suggestions',
  isLoading = false,
  maxItems = 5,
  ...viewProps
}: SuggestionsPopUpProps<T>): ReactElement | null {
  const { theme } = useTheme();
  const styles = createSuggestionsPopUpStyles(theme);

  if (!visible) {
    return null;
  }

  const displayItems = items.slice(0, maxItems);

  const defaultRenderItem = (item: T): ReactElement => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.itemLabel}>{item.label}</Text>
      {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
    </View>
  );

  const renderSuggestionItem = ({ item }: { item: T }): ReactElement => (
    <Pressable
      onPress={() => onSelect(item)}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
    >
      {renderItem ? renderItem(item) : defaultRenderItem(item)}
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={styles.container} {...viewProps}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (displayItems.length === 0) {
    return (
      <View style={styles.container} {...viewProps}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} {...viewProps}>
      <FlatList
        data={displayItems}
        keyExtractor={(item) => item.id}
        renderItem={renderSuggestionItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
