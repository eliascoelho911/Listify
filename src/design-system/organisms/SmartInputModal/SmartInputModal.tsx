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
import { MediaSearchDropdown } from '../../molecules/MediaSearchDropdown/MediaSearchDropdown';
import { MiniCategorySelector } from '../../molecules/MiniCategorySelector/MiniCategorySelector';
import { ParsePreview } from '../../molecules/ParsePreview/ParsePreview';
import type { ParsedElement } from '../../molecules/ParsePreview/ParsePreview.types';
import { useTheme } from '../../theme';
import { createSmartInputModalStyles } from './SmartInputModal.styles';
import type { SmartInputModalProps } from './SmartInputModal.types';

export function SmartInputModal({
  mode = 'item',
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
  placeholder,
  isLoading = false,
  style,
  showCategorySelector = false,
  pendingListName,
  inferredCategoryType,
  onSelectCategory,
  onCancelCategorySelection,
  keepOpen = true,
  mediaSearchMode,
  mediaSearchResults = [],
  isMediaSearchLoading = false,
  mediaSearchError,
  onSelectMediaResult,
  onManualMediaEntry,
  ...viewProps
}: SmartInputModalProps): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createSmartInputModalStyles(theme);
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Determine placeholder based on mode
  const effectivePlaceholder =
    placeholder ?? (mode === 'list' ? 'Nome da lista...' : 'Digite para adicionar...');

  // In list mode, check if we have a valid list name
  const isListMode = mode === 'list';
  const listNameValue = value.trim();
  const hasValidListName = isListMode && listNameValue.length > 0;

  const handleSubmit = useCallback(() => {
    // In list mode, submit is handled via category selection
    if (isListMode) {
      return;
    }

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
  }, [isListMode, parsed, onSubmit, onChangeText, keepOpen, onClose]);

  const handleOverlayPress = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const handleContainerPress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // In item mode: can submit if has title or list name
  // In list mode: submit is via category selector, so disable the send button
  const canSubmit = !isListMode && (parsed.title.trim().length > 0 || !!parsed.listName);

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

            {/* Item mode: Suggestions dropdown positioned above input */}
            {!isListMode && showSuggestions && !showCategorySelector && !mediaSearchMode && (
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

            {/* Media search mode: Show media search dropdown */}
            {!isListMode && mediaSearchMode && value.length >= 2 && (
              <View style={styles.suggestionsContainer}>
                <MediaSearchDropdown
                  results={mediaSearchResults}
                  visible
                  mediaType={mediaSearchMode}
                  isLoading={isMediaSearchLoading}
                  searchQuery={value}
                  errorMessage={mediaSearchError}
                  onSelectResult={onSelectMediaResult ?? (() => {})}
                  onManualEntry={onManualMediaEntry}
                  showManualOption={!!onManualMediaEntry}
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
                placeholder={effectivePlaceholder}
                placeholderTextColor={theme.colors.mutedForeground}
                autoFocus
                multiline={!isListMode}
                returnKeyType={isListMode ? 'done' : 'send'}
                onSubmitEditing={handleSubmit}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                blurOnSubmit={false}
                testID="smart-input-field"
              />
              {/* Hide send button in list mode - submission is via category selection */}
              {!isListMode && (
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
              )}
            </View>

            {/* Item mode: Inline highlight preview (shows parsed text with colored segments) */}
            {!isListMode && value.length > 0 && parsed.highlights.length > 0 && (
              <View style={styles.highlightContainer}>
                <InlineHighlight text={value} highlights={parsed.highlights} />
              </View>
            )}

            {/* Item mode: Parsed elements preview (chips) */}
            {!isListMode && previewElements.length > 0 && !showCategorySelector && (
              <View style={styles.previewContainer}>
                <ParsePreview elements={previewElements} />
              </View>
            )}

            {/* Item mode: Category selector for new list creation via @mention */}
            {!isListMode && showCategorySelector && pendingListName && onSelectCategory && (
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

            {/* List mode: Category selector shown directly when there's a valid list name */}
            {isListMode && hasValidListName && onSelectCategory && (
              <View style={styles.categorySelectorContainer}>
                <View style={styles.categorySelectorHeader}>
                  <View>
                    <Text style={styles.categorySelectorTitle}>Selecione a categoria:</Text>
                    <Text style={styles.categorySelectorListName}>{listNameValue}</Text>
                  </View>
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
