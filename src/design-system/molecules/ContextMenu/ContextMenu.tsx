/**
 * ContextMenu Molecule Component
 *
 * Menu de opções contextual (long press). Inspirado no DropdownMenu do Shadcn.
 */

import React, { type ReactElement } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { Text } from '../../atoms';
import { useTheme } from '../../theme';
import { createContextMenuStyles } from './ContextMenu.styles';
import type { ContextMenuItem, ContextMenuProps } from './ContextMenu.types';

export function ContextMenu({
  items,
  visible,
  onClose,
  onSelect,
  title,
  ...viewProps
}: ContextMenuProps): ReactElement {
  const { theme } = useTheme();
  const styles = createContextMenuStyles(theme);

  const handleSelect = (item: ContextMenuItem) => {
    if (item.disabled) return;
    onSelect(item);
    onClose();
  };

  const renderItem = (item: ContextMenuItem): ReactElement => {
    const Icon = item.icon;

    return (
      <Pressable
        key={item.id}
        onPress={() => handleSelect(item)}
        disabled={item.disabled}
        style={({ pressed }) => [
          styles.item,
          pressed && styles.itemPressed,
          item.disabled && styles.itemDisabled,
        ]}
      >
        {Icon && (
          <Icon
            size={18}
            color={item.destructive ? theme.colors.destructive : theme.colors.foreground}
          />
        )}
        <Text style={[styles.itemLabel, item.destructive && styles.itemLabelDestructive]}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container} {...viewProps}>
          {title && <Text style={styles.title}>{title}</Text>}
          {items.map(renderItem)}
        </View>
      </Pressable>
    </Modal>
  );
}
