/**
 * InboxBottomBar Component
 *
 * Bottom bar for the inbox screen with input and submit button.
 * Detects tags in text and triggers autocomplete.
 */

import React, { type ReactElement, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Badge, Text } from '@design-system/atoms';
import { InputBar } from '@design-system/molecules';
import { useTheme } from '@design-system/theme';

import { useInboxVM } from '../../hooks/useInboxVM';
import { InboxTagSuggestions } from './InboxTagSuggestions';

const TAG_DETECTION_REGEX = /#([a-zA-ZÀ-ÿ0-9_]*)$/;
const DEBOUNCE_MS = 300;

export function InboxBottomBar(): ReactElement {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const vm = useInboxVM();
  const debounceRef = useRef<number | null>(null);

  const handleTextChange = useCallback(
    (text: string) => {
      vm.setInputText(text);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      const match = text.match(TAG_DETECTION_REGEX);
      if (match && match[1].length > 0) {
        debounceRef.current = setTimeout(() => {
          vm.handleSearchTags(match[1]);
        }, DEBOUNCE_MS);
      } else {
        vm.handleClearTagSuggestions();
      }
    },
    [vm],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <InboxTagSuggestions />

      {vm.isEditing && (
        <View style={styles.editingIndicator}>
          <Badge variant="secondary">
            <Text style={styles.editingText}>{t('inbox.editing.indicator')}</Text>
          </Badge>
          <Text style={styles.cancelText} onPress={vm.handleCancelEditing}>
            {t('inbox.editing.cancel')}
          </Text>
        </View>
      )}

      <InputBar
        placeholder={t('inbox.input.placeholder')}
        value={vm.inputText}
        onChangeText={handleTextChange}
        onSubmit={vm.handleSubmit}
        isSubmitting={vm.isSubmitting}
        submitAccessibilityLabel={t('inbox.input.send')}
      />
    </View>
  );
}

const createStyles = (theme: typeof import('@design-system/theme/theme').darkTheme) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    editingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.accent,
    },
    editingText: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.accentForeground,
    },
    cancelText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
      fontFamily: theme.typography.families.body,
    },
  });
