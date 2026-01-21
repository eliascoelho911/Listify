/**
 * ListSuggestionDropdown Molecule Component
 *
 * Displays a dropdown with list suggestions for the SmartInput field.
 * Shows existing lists that match the typed @mention and option to create new.
 */

import React, { type ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { Book, Film, Gamepad2, List, Plus, ShoppingCart, StickyNote } from 'lucide-react-native';

import type { ListType } from '@domain/list';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createListSuggestionDropdownStyles } from './ListSuggestionDropdown.styles';
import type { ListSuggestionDropdownProps } from './ListSuggestionDropdown.types';

const LIST_TYPE_ICONS: Record<ListType, typeof List> = {
  notes: StickyNote,
  shopping: ShoppingCart,
  movies: Film,
  books: Book,
  games: Gamepad2,
};

const LIST_TYPE_LABELS: Record<ListType, string> = {
  notes: 'Notas',
  shopping: 'Compras',
  movies: 'Filmes',
  books: 'Livros',
  games: 'Jogos',
};

export function ListSuggestionDropdown({
  suggestions,
  onSelectList,
  onSelectSection,
  showCreateOption = true,
  onCreateNew,
  searchText,
  visible,
  style,
  maxSuggestions = 5,
  ...viewProps
}: ListSuggestionDropdownProps): ReactElement {
  const { theme } = useTheme();
  const styles = createListSuggestionDropdownStyles(theme);

  if (!visible) {
    return <View style={[styles.container, styles.hidden]} {...viewProps} />;
  }

  const displayedSuggestions = suggestions.slice(0, maxSuggestions);
  const hasExactMatch = suggestions.some((s) => s.name.toLowerCase() === searchText?.toLowerCase());
  const showCreate = showCreateOption && searchText && !hasExactMatch && onCreateNew;

  return (
    <View style={[styles.container, style]} {...viewProps}>
      {displayedSuggestions.length === 0 && !showCreate && (
        <Text style={styles.emptyText}>Nenhuma lista encontrada</Text>
      )}

      {displayedSuggestions.map((suggestion, index) => (
        <React.Fragment key={suggestion.id}>
          {index > 0 && <View style={styles.separator} />}
          <Pressable
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            onPress={() => onSelectList(suggestion)}
            accessibilityRole="button"
            accessibilityLabel={`Selecionar lista ${suggestion.name}`}
          >
            <View style={styles.itemIcon}>
              <Icon
                icon={LIST_TYPE_ICONS[suggestion.listType]}
                size="md"
                color={theme.colors.mutedForeground}
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{suggestion.name}</Text>
              <Text style={styles.itemType}>{LIST_TYPE_LABELS[suggestion.listType]}</Text>
              {suggestion.sections && suggestion.sections.length > 0 && (
                <Text style={styles.itemSections} numberOfLines={1}>
                  Seções: {suggestion.sections.join(', ')}
                </Text>
              )}
            </View>
          </Pressable>
        </React.Fragment>
      ))}

      {showCreate && (
        <Pressable
          style={({ pressed }) => [styles.createItem, pressed && styles.itemPressed]}
          onPress={() => onCreateNew(searchText)}
          accessibilityRole="button"
          accessibilityLabel={`Criar nova lista ${searchText}`}
        >
          <View style={styles.itemIcon}>
            <Icon icon={Plus} size="md" color={theme.colors.primary} />
          </View>
          <Text style={styles.createItemText}>
            Criar <Text style={styles.createItemName}>"{searchText}"</Text>
          </Text>
        </Pressable>
      )}
    </View>
  );
}
