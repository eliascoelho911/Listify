/**
 * ItemCard Molecule Component
 *
 * Generic card for displaying items of any type in the Inbox.
 * Renders differently based on item type (note, shopping, movie, book, game).
 */

import React, { type ReactElement, useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import {
  BookOpen,
  FileText,
  Film,
  Gamepad2,
  type LucideIcon,
  ShoppingCart,
} from 'lucide-react-native';

import type { Item, ItemType, ShoppingItem } from '@domain/item/entities/item.entity';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createItemCardStyles } from './ItemCard.styles';
import type { ItemCardProps } from './ItemCard.types';

const ITEM_TYPE_ICONS: Record<ItemType, LucideIcon> = {
  note: FileText,
  shopping: ShoppingCart,
  movie: Film,
  book: BookOpen,
  game: Gamepad2,
};

function getItemTypeColor(
  type: ItemType,
  colors: {
    itemNote: string;
    itemShopping: string;
    itemMovie: string;
    itemBook: string;
    itemGame: string;
  },
): string {
  const colorMap: Record<ItemType, string> = {
    note: colors.itemNote,
    shopping: colors.itemShopping,
    movie: colors.itemMovie,
    book: colors.itemBook,
    game: colors.itemGame,
  };
  return colorMap[type];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}m`;
  }
  if (hours < 24) {
    return `${hours}h`;
  }
  if (days < 7) {
    return `${days}d`;
  }
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

function isCheckedItem(item: Item): boolean {
  if (item.type === 'note') return false;
  return item.isChecked === true;
}

function getItemSubtitle(item: Item): string | undefined {
  switch (item.type) {
    case 'note':
      return item.description?.substring(0, 100);
    case 'shopping':
      return item.quantity;
    case 'movie':
      return item.metadata?.description?.substring(0, 100);
    case 'book':
      return item.metadata?.authors?.join(', ');
    case 'game':
      return item.metadata?.developer;
    default:
      return undefined;
  }
}

export function ItemCard({
  item,
  listName,
  showListBadge = true,
  onPress,
  onLongPress,
  selected = false,
  style,
  ...viewProps
}: ItemCardProps): ReactElement {
  const { theme } = useTheme();
  const styles = createItemCardStyles(theme, selected);

  const handlePress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  const handleLongPress = useCallback(() => {
    onLongPress?.(item);
  }, [item, onLongPress]);

  const iconColor = useMemo(
    () => getItemTypeColor(item.type, theme.colors),
    [item.type, theme.colors],
  );
  const subtitle = useMemo(() => getItemSubtitle(item), [item]);
  const isChecked = useMemo(() => isCheckedItem(item), [item]);

  const renderShoppingMeta = () => {
    if (item.type !== 'shopping') return null;
    const shoppingItem = item as ShoppingItem;

    return (
      <View style={styles.metaRow}>
        {shoppingItem.quantity && <Text style={styles.quantity}>{shoppingItem.quantity}</Text>}
        {shoppingItem.price !== undefined && shoppingItem.price > 0 && (
          <Text style={styles.price}>{formatPrice(shoppingItem.price)}</Text>
        )}
      </View>
    );
  };

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.type} item`}
      {...viewProps}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Icon icon={ITEM_TYPE_ICONS[item.type]} size="md" color={iconColor} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, isChecked && styles.checkedTitle]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
        </View>

        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}

        {renderShoppingMeta()}

        {showListBadge && listName && (
          <View style={styles.metaRow}>
            <View style={styles.listBadge}>
              <Icon
                icon={ITEM_TYPE_ICONS[item.type]}
                size="sm"
                color={theme.colors.mutedForeground}
              />
              <Text style={styles.listBadgeText}>{listName}</Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}
