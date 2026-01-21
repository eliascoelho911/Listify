/**
 * SmartInputModal Organism Component
 *
 * Bottom sheet modal for smart input. Displays input field with inline highlights,
 * parse preview chips, list suggestions dropdown, and category selector for new lists.
 */

import React, { type ReactElement, useCallback, useMemo, useRef, useState } from 'react';
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
import { Send, X } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { InlineHighlight } from '../../molecules/InlineHighlight/InlineHighlight';
import { ListSuggestionDropdown } from '../../molecules/ListSuggestionDropdown/ListSuggestionDropdown';
import { MiniCategorySelector } from '../../molecules/MiniCategorySelector/MiniCategorySelector';
import { ParsePreview } from '../../molecules/ParsePreview/ParsePreview';
import type { ParsedElement } from '../../molecules/ParsePreview/ParsePreview.types';
import { useTheme } from '../../theme';
import { createSmartInputModalStyles } from './SmartInputModal.styles';
import type { SmartInputModalProps } from './SmartInputModal.types';

export function SmartInputModal({
  visible,
  onClose,
  onSubmit,
  value,
  onChangeText,
  parsed,
  listSuggestions,
  showSuggestions,
  onSelectList,
  onCreateList,
  placeholder = 'Digite para adicionar...',
  isLoading = false,
  style,
  showCategorySelector = false,
  pendingListName,
  inferredCategoryType,
  onSelectCategory,
  onCancelCategorySelection,
  keepOpen = true,
  ...viewProps
}: SmartInputModalProps): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createSmartInputModalStyles(theme);
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!parsed.title.trim() && !parsed.listName) {
      return;
    }
    onSubmit(parsed);
    onChangeText('');

    // Only close and dismiss keyboard if not in continuous mode
    if (!keepOpen) {
      Keyboard.dismiss();
      onClose();
    }
    // In keepOpen mode, keep focus on input for continuous creation
  }, [parsed, onSubmit, onChangeText, keepOpen, onClose]);

  const handleOverlayPress = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const handleContainerPress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const canSubmit = parsed.title.trim().length > 0 || !!parsed.listName;

  // Convert parsed result to ParsedElement array for ParsePreview
  const previewElements = useMemo((): ParsedElement[] => {
    const elements: ParsedElement[] = [];

    if (parsed.listName) {
      elements.push({
        type: 'list',
        value: `@${parsed.listName}`,
      });
    }

    if (parsed.sectionName) {
      elements.push({
        type: 'section',
        value: parsed.sectionName,
      });
    }

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

  // Extract list name being typed for suggestions
  const typedListName = useMemo(() => {
    const match = /@([^\s:@]*)$/.exec(value);
    return match ? match[1] : null;
  }, [value]);

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
            {...viewProps}
          >
            <View style={styles.handle} />

            {/* Suggestions dropdown positioned above input */}
            {showSuggestions && !showCategorySelector && (
              <View style={styles.suggestionsContainer}>
                <ListSuggestionDropdown
                  suggestions={listSuggestions}
                  visible={showSuggestions}
                  onSelectList={onSelectList}
                  onCreateNew={onCreateList}
                  searchText={typedListName ?? undefined}
                  showCreateOption={!!onCreateList}
                />
              </View>
            )}

            {/* Input field */}
            <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.mutedForeground}
                autoFocus
                multiline
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                blurOnSubmit={false}
                testID="smart-input-field"
              />
              <Pressable
                style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={!canSubmit || isLoading}
                accessibilityRole="button"
                accessibilityLabel="Submit"
                testID="smart-input-submit"
              >
                <Icon icon={Send} size="sm" color={theme.colors.primaryForeground} />
              </Pressable>
            </View>

            {/* Inline highlight preview (shows parsed text with colored segments) */}
            {value.length > 0 && parsed.highlights.length > 0 && (
              <View style={styles.highlightContainer}>
                <InlineHighlight text={value} highlights={parsed.highlights} />
              </View>
            )}

            {/* Parsed elements preview (chips) */}
            {previewElements.length > 0 && !showCategorySelector && (
              <View style={styles.previewContainer}>
                <ParsePreview elements={previewElements} />
              </View>
            )}

            {/* Category selector for new list creation */}
            {showCategorySelector && pendingListName && onSelectCategory && (
              <View style={styles.categorySelectorContainer}>
                <View style={styles.categorySelectorHeader}>
                  <View>
                    <Text style={styles.categorySelectorTitle}>Criar lista:</Text>
                    <Text style={styles.categorySelectorListName}>{pendingListName}</Text>
                  </View>
                  {onCancelCategorySelection && (
                    <Pressable
                      style={styles.cancelButton}
                      onPress={onCancelCategorySelection}
                      accessibilityRole="button"
                      accessibilityLabel="Cancelar"
                    >
                      <Icon icon={X} size="sm" color={theme.colors.mutedForeground} />
                    </Pressable>
                  )}
                </View>
                <MiniCategorySelector
                  onSelect={onSelectCategory}
                  inferredType={inferredCategoryType}
                />
              </View>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
