/**
 * MiniCategorySelector Molecule Component
 *
 * A compact horizontal category selector for list type selection.
 * Used when creating a new list with low/medium inference confidence.
 */

import React, { type ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { Book, Film, Gamepad2, ShoppingCart } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createMiniCategorySelectorStyles } from './MiniCategorySelector.styles';
import type { MiniCategorySelectorProps, SelectableListType } from './MiniCategorySelector.types';

/**
 * Category configuration with icons and labels
 */
const CATEGORY_CONFIG: Record<SelectableListType, { icon: typeof ShoppingCart; label: string }> = {
  shopping: { icon: ShoppingCart, label: 'Compras' },
  movies: { icon: Film, label: 'Filmes' },
  books: { icon: Book, label: 'Livros' },
  games: { icon: Gamepad2, label: 'Games' },
};

const CATEGORY_ORDER: SelectableListType[] = ['shopping', 'movies', 'books', 'games'];

export function MiniCategorySelector({
  selectedType,
  onSelect,
  style,
  showLabels = true,
  inferredType,
  ...viewProps
}: MiniCategorySelectorProps): ReactElement {
  const { theme } = useTheme();
  const styles = createMiniCategorySelectorStyles(theme);

  return (
    <View style={[styles.container, style]} {...viewProps}>
      {CATEGORY_ORDER.map((type) => {
        const config = CATEGORY_CONFIG[type];
        const isSelected = selectedType === type;
        const isInferred = inferredType === type && !isSelected;

        const optionStyles = [
          styles.option,
          isSelected && styles.optionSelected,
          isInferred && styles.optionInferred,
        ];

        const labelStyles = [
          styles.label,
          isSelected && styles.labelSelected,
          isInferred && styles.labelInferred,
        ];

        const iconColor = isSelected
          ? theme.colors.primaryForeground
          : isInferred
            ? theme.colors.primary
            : theme.colors.mutedForeground;

        return (
          <Pressable
            key={type}
            style={optionStyles}
            onPress={() => onSelect(type)}
            accessibilityRole="button"
            accessibilityLabel={`${config.label}${isSelected ? ', selecionado' : ''}`}
            accessibilityState={{ selected: isSelected }}
          >
            <View style={styles.iconWrapper}>
              <Icon icon={config.icon} size="sm" color={iconColor} />
            </View>
            {showLabels && <Text style={labelStyles}>{config.label}</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}
