/**
 * ListForm Organism Component
 *
 * A form for creating or editing lists with name input and category selection.
 */

import React, { type ReactElement, useCallback, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '../../atoms/Text/Text';
import { CategorySelector } from '../../molecules/CategorySelector/CategorySelector';
import { useTheme } from '../../theme';
import { createListFormStyles } from './ListForm.styles';
import type { ListFormData, ListFormProps, SelectableListType } from './ListForm.types';

export function ListForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  isEditing = false,
  style,
  testID,
}: ListFormProps): ReactElement {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createListFormStyles(theme);

  const [name, setName] = useState(initialData?.name ?? '');
  const [listType, setListType] = useState<SelectableListType>(
    initialData?.listType ?? 'shopping',
  );
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const isNameValid = name.trim().length > 0;
  const showNameError = touched && !isNameValid;

  const handleSubmit = useCallback(() => {
    setTouched(true);

    if (!isNameValid) {
      return;
    }

    const data: ListFormData = {
      name: name.trim(),
      listType,
    };

    onSubmit(data);
  }, [name, listType, isNameValid, onSubmit]);

  const handleNameBlur = useCallback(() => {
    setIsFocused(false);
    setTouched(true);
  }, []);

  return (
    <View style={[styles.container, style]} testID={testID}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Name Input Section */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('listForm.nameLabel')}</Text>
          <TextInput
            style={[
              styles.input,
              isFocused && styles.inputFocused,
              (showNameError || error) && styles.inputError,
            ]}
            value={name}
            onChangeText={setName}
            onFocus={() => setIsFocused(true)}
            onBlur={handleNameBlur}
            placeholder={t('listForm.namePlaceholder')}
            placeholderTextColor={theme.colors.mutedForeground}
            autoFocus
            editable={!isLoading}
            testID={testID ? `${testID}-name-input` : undefined}
          />
          {showNameError && (
            <Text style={styles.errorText}>{t('listForm.nameRequired')}</Text>
          )}
          {error && !showNameError && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        {/* Category Selector Section */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('listForm.categoryLabel')}</Text>
          <CategorySelector
            selectedType={listType}
            onSelect={setListType}
            testID={testID ? `${testID}-category` : undefined}
          />
        </View>
      </ScrollView>

      {/* Footer with buttons */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.button, styles.buttonSecondary]}
          onPress={onCancel}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel={t('common.cancel')}
          testID={testID ? `${testID}-cancel-button` : undefined}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            {t('common.cancel')}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            styles.buttonPrimary,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel={isEditing ? t('listForm.save') : t('listForm.create')}
          testID={testID ? `${testID}-submit-button` : undefined}
        >
          <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
            {isEditing ? t('listForm.save') : t('listForm.create')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
