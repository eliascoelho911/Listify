/**
 * CategoryDropdown Organism Component
 *
 * Expandable dropdown for grouping lists by category (Shopping, Movies, Books, Games).
 * Shows category icon, label, list count, and expands to show ListCard components.
 */

import React, { type ReactElement, useCallback, useMemo } from 'react';
import { Pressable, type StyleProp, View, type ViewStyle } from 'react-native';
import {
  BookOpen,
  ChevronDown,
  Film,
  Gamepad2,
  ShoppingCart,
  StickyNote,
} from 'lucide-react-native';

import type { List, ListType } from '@domain/list';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { ListCard } from '../../molecules/ListCard/ListCard';
import { useTheme } from '../../theme';
import { createCategoryDropdownStyles } from './CategoryDropdown.styles';
import type { CategoryDropdownProps, CategoryInfoMap } from './CategoryDropdown.types';

const CATEGORY_INFO: CategoryInfoMap = {
  notes: { icon: StickyNote, label: 'Notas', colorKey: 'itemNote' },
  shopping: { icon: ShoppingCart, label: 'Compras', colorKey: 'itemShopping' },
  movies: { icon: Film, label: 'Filmes', colorKey: 'itemMovie' },
  books: { icon: BookOpen, label: 'Livros', colorKey: 'itemBook' },
  games: { icon: Gamepad2, label: 'Jogos', colorKey: 'itemGame' },
};

function getCategoryColor(
  category: ListType,
  colors: {
    itemNote: string;
    itemShopping: string;
    itemMovie: string;
    itemBook: string;
    itemGame: string;
  },
): string {
  const colorMap: Record<ListType, string> = {
    notes: colors.itemNote,
    shopping: colors.itemShopping,
    movies: colors.itemMovie,
    books: colors.itemBook,
    games: colors.itemGame,
  };
  return colorMap[category];
}

export function CategoryDropdown({
  category,
  lists,
  itemCounts = {},
  expanded = true,
  onToggleExpand,
  onListPress,
  onListLongPress,
  testID,
  ...viewProps
}: CategoryDropdownProps): ReactElement {
  const { theme } = useTheme();
  const styles = createCategoryDropdownStyles(theme, expanded);

  const categoryInfo = useMemo(() => CATEGORY_INFO[category], [category]);
  const categoryColor = useMemo(
    () => getCategoryColor(category, theme.colors),
    [category, theme.colors],
  );

  const handleHeaderPress = useCallback(() => {
    onToggleExpand?.();
  }, [onToggleExpand]);

  const handleListPress = useCallback(
    (list: List) => {
      onListPress?.(list);
    },
    [onListPress],
  );

  const handleListLongPress = useCallback(
    (list: List) => {
      onListLongPress?.(list);
    },
    [onListLongPress],
  );

  return (
    <View style={styles.container} testID={testID} {...viewProps}>
      <Pressable
        style={({ pressed }) => [
          styles.header as StyleProp<ViewStyle>,
          pressed && (styles.headerPressed as StyleProp<ViewStyle>),
        ]}
        onPress={handleHeaderPress}
        accessibilityRole="button"
        accessibilityLabel={`${categoryInfo.label} category, ${lists.length} lists, ${expanded ? 'expanded' : 'collapsed'}`}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
            <Icon icon={categoryInfo.icon} size="md" color={categoryColor} />
          </View>
          <Text style={styles.categoryLabel}>{categoryInfo.label}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{lists.length}</Text>
          </View>
        </View>
        <View style={styles.chevron}>
          <Icon icon={ChevronDown} size="sm" color={theme.colors.mutedForeground} />
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.content}>
          {lists.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma lista</Text>
          ) : (
            lists.map((list) => (
              <View key={list.id} style={styles.listCardWrapper}>
                <ListCard
                  list={list}
                  itemCount={itemCounts[list.id]}
                  onPress={handleListPress}
                  onLongPress={handleListLongPress}
                />
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
}
