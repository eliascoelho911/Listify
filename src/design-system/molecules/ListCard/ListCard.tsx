/**
 * ListCard Molecule Component
 *
 * Card component for displaying list information in the Lists screen.
 * Renders list name, description, item count, and type-specific icon.
 */

import React, { type ReactElement, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, type StyleProp, View, type ViewStyle } from 'react-native';
import { BookOpen, Film, Gamepad2, Lock, ShoppingCart, StickyNote } from 'lucide-react-native';

import type { ListType } from '@domain/list';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createListCardStyles } from './ListCard.styles';
import type { ListCardProps, ListTypeInfoMap } from './ListCard.types';

const LIST_TYPE_INFO: ListTypeInfoMap = {
  notes: { icon: StickyNote, colorKey: 'itemNote', labelKey: 'listTypes.notes' },
  shopping: { icon: ShoppingCart, colorKey: 'itemShopping', labelKey: 'listTypes.shopping' },
  movies: { icon: Film, colorKey: 'itemMovie', labelKey: 'listTypes.movies' },
  books: { icon: BookOpen, colorKey: 'itemBook', labelKey: 'listTypes.books' },
  games: { icon: Gamepad2, colorKey: 'itemGame', labelKey: 'listTypes.games' },
};

function getListTypeColor(
  listType: ListType,
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
  return colorMap[listType];
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

function formatItemCount(count: number, t: TFunction): string {
  if (count === 0) return t('listCard.itemCount.empty');
  if (count === 1) return t('listCard.itemCount.one');
  return t('listCard.itemCount.many', { count });
}

export function ListCard({
  list,
  itemCount,
  onPress,
  onLongPress,
  selected = false,
  customIcon,
  testID,
  ...pressableProps
}: ListCardProps): ReactElement {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createListCardStyles(theme, selected);

  const handlePress = useCallback(() => {
    onPress?.(list);
  }, [list, onPress]);

  const handleLongPress = useCallback(() => {
    onLongPress?.(list);
  }, [list, onLongPress]);

  const typeInfo = useMemo(() => LIST_TYPE_INFO[list.listType], [list.listType]);
  const typeLabel = useMemo(() => t(typeInfo.labelKey), [t, typeInfo.labelKey]);
  const iconColor = useMemo(
    () => getListTypeColor(list.listType, theme.colors),
    [list.listType, theme.colors],
  );
  const IconComponent = customIcon ?? typeInfo.icon;

  const accessibilityLabel = t('listCard.accessibilityLabel', {
    name: list.name,
    type: typeLabel,
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container as StyleProp<ViewStyle>,
        pressed && (styles.pressed as StyleProp<ViewStyle>),
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      {...pressableProps}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Icon icon={IconComponent} size="md" color={iconColor} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {list.name}
          </Text>
          {itemCount !== undefined && (
            <Text style={styles.itemCount}>{formatItemCount(itemCount, t)}</Text>
          )}
        </View>

        {list.description && (
          <Text style={styles.description} numberOfLines={1}>
            {list.description}
          </Text>
        )}

        {list.isPrefabricated && (
          <View style={styles.prefabBadge}>
            <Icon icon={Lock} size="sm" color={theme.colors.mutedForeground} />
            <Text style={styles.prefabBadgeText}>{t('listCard.systemBadge')}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
