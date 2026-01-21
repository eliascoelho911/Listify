/**
 * CategorySelector Molecule Component
 *
 * A full-size category selector for list type selection in forms.
 * Shows all available list types with icons, labels, and descriptions.
 */

import { Book, Check, Film, Gamepad2, type LucideIcon, ShoppingCart } from 'lucide-react-native';
import React, { type ReactElement, useCallback } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createCategorySelectorStyles } from './CategorySelector.styles';
import type { CategorySelectorProps, SelectableListType } from './CategorySelector.types';

interface CategoryConfig {
  icon: LucideIcon;
  label: string;
  description: string;
}

const CATEGORY_CONFIG: Record<SelectableListType, CategoryConfig> = {
  shopping: {
    icon: ShoppingCart,
    label: 'Compras',
    description: 'Lista de compras com preços e quantidades',
  },
  movies: {
    icon: Film,
    label: 'Filmes',
    description: 'Filmes e séries para assistir',
  },
  books: {
    icon: Book,
    label: 'Livros',
    description: 'Livros para ler',
  },
  games: {
    icon: Gamepad2,
    label: 'Games',
    description: 'Jogos para jogar',
  },
};

const CATEGORY_ORDER: SelectableListType[] = ['shopping', 'movies', 'books', 'games'];

export function CategorySelector({
  selectedType,
  onSelect,
  style,
  testID,
}: CategorySelectorProps): ReactElement {
  const { theme } = useTheme();

  const renderOption = useCallback(
    (type: SelectableListType) => {
      const config = CATEGORY_CONFIG[type];
      const isSelected = selectedType === type;
      const styles = createCategorySelectorStyles(theme, isSelected);

      return (
        <Pressable
          key={type}
          style={[styles.option, isSelected && styles.optionSelected]}
          onPress={() => onSelect(type)}
          accessibilityRole="radio"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={`${config.label}, ${config.description}`}
          testID={testID ? `${testID}-${type}` : undefined}
        >
          <View style={styles.iconContainer}>
            <Icon
              icon={config.icon}
              size="md"
              color={isSelected ? theme.colors.primaryForeground : theme.colors.mutedForeground}
            />
          </View>
          <View style={styles.content}>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{config.label}</Text>
            <Text style={styles.description}>{config.description}</Text>
          </View>
          {isSelected && (
            <View style={styles.checkmark}>
              <Icon icon={Check} size="sm" color={theme.colors.primaryForeground} />
            </View>
          )}
        </Pressable>
      );
    },
    [selectedType, onSelect, theme, testID],
  );

  const baseStyles = createCategorySelectorStyles(theme, false);

  return (
    <View style={[baseStyles.container, style]} testID={testID} accessibilityRole="radiogroup">
      {CATEGORY_ORDER.map(renderOption)}
    </View>
  );
}
