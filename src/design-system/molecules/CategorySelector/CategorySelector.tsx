/**
 * CategorySelector Molecule Component
 *
 * A full-size category selector for list type selection in forms.
 * Shows all available list types with icons, labels, and descriptions.
 */

import React, { type ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { Book, Check, Film, Gamepad2, type LucideIcon, ShoppingCart } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createCategorySelectorStyles } from './CategorySelector.styles';
import type { CategorySelectorProps, SelectableListType } from './CategorySelector.types';

const CATEGORY_ICONS: Record<SelectableListType, LucideIcon> = {
  shopping: ShoppingCart,
  movies: Film,
  books: Book,
  games: Gamepad2,
};

const CATEGORY_ORDER: SelectableListType[] = ['shopping', 'movies', 'books', 'games'];

export function CategorySelector({
  selectedType,
  onSelect,
  style,
  testID,
}: CategorySelectorProps): ReactElement {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const renderOption = useCallback(
    (type: SelectableListType) => {
      const icon = CATEGORY_ICONS[type];
      const label = t(`listTypes.${type}`);
      const description = t(`categoryDescriptions.${type}`);
      const isSelected = selectedType === type;
      const styles = createCategorySelectorStyles(theme, isSelected);

      return (
        <Pressable
          key={type}
          style={[styles.option, isSelected && styles.optionSelected]}
          onPress={() => onSelect(type)}
          accessibilityRole="radio"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={`${label}, ${description}`}
          testID={testID ? `${testID}-${type}` : undefined}
        >
          <View style={styles.iconContainer}>
            <Icon
              icon={icon}
              size="md"
              color={isSelected ? theme.colors.primaryForeground : theme.colors.mutedForeground}
            />
          </View>
          <View style={styles.content}>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{label}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          {isSelected && (
            <View style={styles.checkmark}>
              <Icon icon={Check} size="sm" color={theme.colors.primaryForeground} />
            </View>
          )}
        </Pressable>
      );
    },
    [selectedType, onSelect, theme, testID, t],
  );

  const baseStyles = createCategorySelectorStyles(theme, false);

  return (
    <View style={[baseStyles.container, style]} testID={testID} accessibilityRole="radiogroup">
      {CATEGORY_ORDER.map(renderOption)}
    </View>
  );
}
