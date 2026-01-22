/**
 * EditModal Organism Component
 *
 * Bottom sheet modal for editing items. Pre-fills with current item data
 * and allows editing via smart input parsing. Also supports item deletion.
 */

import React, { type ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, Trash2, X } from 'lucide-react-native';

import type { ParsedInput } from '@domain/common';
import type { ShoppingItem } from '@domain/item';

import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { InlineHighlight } from '../../molecules/InlineHighlight/InlineHighlight';
import { ParsePreview } from '../../molecules/ParsePreview/ParsePreview';
import type { ParsedElement } from '../../molecules/ParsePreview/ParsePreview.types';
import { useTheme } from '../../theme';
import { createEditModalStyles } from './EditModal.styles';
import type { EditModalProps } from './EditModal.types';
import { shoppingItemToEditableString } from './EditModal.types';

/**
 * Creates an empty parsed input
 */
function createEmptyParsedInput(): ParsedInput {
  return {
    title: '',
    listName: null,
    sectionName: null,
    quantity: null,
    price: null,
    rawText: '',
    highlights: [],
  };
}

/**
 * Simple parser for edit mode - extracts quantity and price from text
 * Does NOT use @list:section syntax since we're editing an existing item
 */
function parseEditInput(text: string): ParsedInput {
  const result: ParsedInput = {
    title: text.trim(),
    listName: null,
    sectionName: null,
    quantity: null,
    price: null,
    rawText: text,
    highlights: [],
  };

  // Extract price pattern: R$XX,XX or R$XX.XX or R$ XX,XX
  const priceRegex = /R\$\s*(\d+(?:[.,]\d{1,2})?)/gi;
  const priceMatch = priceRegex.exec(text);
  if (priceMatch) {
    const priceValue = priceMatch[1].replace(',', '.');
    result.price = parseFloat(priceValue);
    result.highlights.push({
      type: 'price',
      start: priceMatch.index,
      end: priceMatch.index + priceMatch[0].length,
      value: priceMatch[0],
    });
    // Remove price from title
    result.title = text.replace(priceMatch[0], '').trim();
  }

  // Extract quantity pattern: Xkg, Xg, Xml, Xl, Xun, Xund, Xunidade(s)
  // Also matches simple numbers with units
  const quantityRegex = /(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l|un|und|unidades?)\b/gi;
  const quantityMatch = quantityRegex.exec(result.title);
  if (quantityMatch) {
    result.quantity = quantityMatch[0];
    result.highlights.push({
      type: 'quantity',
      start: text.indexOf(quantityMatch[0]),
      end: text.indexOf(quantityMatch[0]) + quantityMatch[0].length,
      value: quantityMatch[0],
    });
    // Remove quantity from title
    result.title = result.title.replace(quantityMatch[0], '').trim();
  }

  // Clean up title - remove extra whitespace
  result.title = result.title.replace(/\s+/g, ' ').trim();

  return result;
}

export function EditModal({
  visible,
  item,
  onClose,
  onSubmit,
  onDelete,
  isLoading = false,
  placeholder,
  style,
  testID,
}: EditModalProps): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const styles = createEditModalStyles(theme);
  const inputRef = useRef<TextInput>(null);

  const [inputValue, setInputValue] = useState('');
  const [parsed, setParsed] = useState<ParsedInput>(createEmptyParsedInput());
  const [isFocused, setIsFocused] = useState(false);

  // Pre-fill input when item changes or modal opens
  useEffect(() => {
    if (visible && item) {
      let initialValue = item.title;

      // For shopping items, include quantity and price in the editable text
      if (item.type === 'shopping') {
        initialValue = shoppingItemToEditableString(item as ShoppingItem);
      }

      setInputValue(initialValue);
      setParsed(parseEditInput(initialValue));
    } else if (!visible) {
      // Reset when modal closes
      setInputValue('');
      setParsed(createEmptyParsedInput());
    }
  }, [visible, item]);

  const handleTextChange = useCallback((text: string) => {
    setInputValue(text);
    setParsed(parseEditInput(text));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!parsed.title.trim() || !item) {
      return;
    }

    onSubmit({
      parsed,
      updates: {
        title: parsed.title,
        quantity: parsed.quantity ?? undefined,
        price: parsed.price ?? undefined,
      },
    });

    Keyboard.dismiss();
    onClose();
  }, [parsed, item, onSubmit, onClose]);

  const handleDelete = useCallback(() => {
    if (item && onDelete) {
      onDelete(item);
      onClose();
    }
  }, [item, onDelete, onClose]);

  const handleOverlayPress = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const handleContainerPress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const canSubmit = parsed.title.trim().length > 0;

  // Convert parsed result to ParsedElement array for ParsePreview
  const previewElements = useMemo((): ParsedElement[] => {
    const elements: ParsedElement[] = [];

    if (parsed.quantity) {
      elements.push({
        type: 'quantity',
        value: parsed.quantity,
      });
    }

    if (parsed.price !== null) {
      elements.push({
        type: 'price',
        value: `R$${parsed.price.toFixed(2).replace('.', ',')}`,
      });
    }

    return elements;
  }, [parsed]);

  const effectivePlaceholder = placeholder ?? t('edit.placeholder', 'Editar item...');

  if (!visible) {
    return <View style={styles.hidden} />;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.overlay} onPress={handleOverlayPress}>
          <Pressable
            style={[styles.container, { paddingBottom: insets.bottom + theme.spacing.md }, style]}
            onPress={handleContainerPress}
            testID={testID}
          >
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{t('edit.title', 'Editar item')}</Text>
              <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar">
                <Icon icon={X} size="md" color={theme.colors.mutedForeground} />
              </Pressable>
            </View>

            {/* Input field */}
            <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={inputValue}
                onChangeText={handleTextChange}
                placeholder={effectivePlaceholder}
                placeholderTextColor={theme.colors.mutedForeground}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                blurOnSubmit={false}
                testID="edit-modal-input"
              />
              <Pressable
                style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={!canSubmit || isLoading}
                accessibilityRole="button"
                accessibilityLabel={t('common.save', 'Salvar')}
                testID="edit-modal-submit"
              >
                <Icon icon={Send} size="sm" color={theme.colors.primaryForeground} />
              </Pressable>
            </View>

            {/* Inline highlight preview */}
            {inputValue.length > 0 && parsed.highlights.length > 0 && (
              <View style={styles.highlightContainer}>
                <InlineHighlight text={inputValue} highlights={parsed.highlights} />
              </View>
            )}

            {/* Parsed elements preview (chips) */}
            {previewElements.length > 0 && (
              <View style={styles.previewContainer}>
                <ParsePreview elements={previewElements} />
              </View>
            )}

            {/* Actions row with delete button */}
            <View style={styles.actionsContainer}>
              {onDelete && (
                <Pressable
                  style={styles.deleteButton}
                  onPress={handleDelete}
                  accessibilityRole="button"
                  accessibilityLabel={t('common.delete', 'Excluir')}
                  testID="edit-modal-delete"
                >
                  <Icon icon={Trash2} size="sm" color={theme.colors.destructive} />
                  <Text style={styles.deleteButtonText}>{t('common.delete', 'Excluir')}</Text>
                </Pressable>
              )}

              <View style={styles.buttonsRow}>
                <Button variant="ghost" size="sm" onPress={onClose}>
                  {t('common.cancel', 'Cancelar')}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onPress={handleSubmit}
                  disabled={!canSubmit || isLoading}
                >
                  {t('common.save', 'Salvar')}
                </Button>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
