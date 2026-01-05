import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputSubmitEditingEventData,
  View,
} from 'react-native';

import type { CreateItemFromFreeTextResult } from '@domain/shopping/use-cases/CreateItemFromFreeText';
import { theme } from '@design-system/theme/theme';

type AddItemInputProps = {
  value: string;
  preview: CreateItemFromFreeTextResult | null;
  isSubmitting?: boolean;
  disabled?: boolean;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
};

export function AddItemInput({
  value,
  preview,
  isSubmitting = false,
  disabled = false,
  onChangeText,
  onSubmit,
}: AddItemInputProps): ReactElement {
  const { t } = useTranslation();

  const previewTokens = useMemo(() => buildPreviewTokens(preview, t), [preview, t]);

  const handleSubmitEditing = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ): void => {
    event.preventDefault();
    if (disabled || isSubmitting) {
      return;
    }
    Keyboard.dismiss();
    onSubmit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          accessibilityLabel={t('shoppingList.add.accessibilityLabel')}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={t('shoppingList.add.placeholder')}
          placeholderTextColor={theme.colors.content.muted}
          value={value}
          editable={!disabled && !isSubmitting}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmitEditing}
          returnKeyType="done"
          style={styles.textInput}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('shoppingList.add.submit')}
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
            (disabled || isSubmitting) && styles.submitButtonDisabled,
          ]}
          onPress={onSubmit}
          disabled={disabled || isSubmitting}
        >
          <Text style={styles.submitLabel}>
            {isSubmitting ? t('shoppingList.add.sending') : t('shoppingList.add.submit')}
          </Text>
        </Pressable>
      </View>

      {previewTokens.length > 0 ? (
        <View style={styles.previewRow}>
          {previewTokens.map((token) => (
            <View key={token.label} style={styles.previewChip}>
              <Text style={styles.previewLabel}>{token.label}</Text>
              <Text style={styles.previewValue}>{token.value}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

type PreviewToken = {
  label: string;
  value: string;
};

function buildPreviewTokens(
  preview: CreateItemFromFreeTextResult | null,
  t: (key: string, options?: Record<string, unknown>) => string,
): PreviewToken[] {
  if (!preview) {
    return [];
  }

  return [
    {
      label: t('shoppingList.preview.quantity'),
      value: preview.quantity.toString(),
    },
    {
      label: t('shoppingList.preview.unit'),
      value: preview.unit,
    },
    {
      label: t('shoppingList.preview.category'),
      value: preview.category,
    },
    {
      label: t('shoppingList.preview.name'),
      value: preview.name,
    },
  ];
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.muted,
    borderRadius: theme.radii.md,
    color: theme.colors.content.primary,
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.normal,
  },
  submitButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.brand[600],
    borderRadius: theme.radii.md,
    justifyContent: 'center',
  },
  submitButtonPressed: {
    backgroundColor: theme.colors.brand[700],
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.border.muted,
  },
  submitLabel: {
    color: theme.colors.content.inverse,
    fontFamily: theme.typography.families.heading,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
  previewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  previewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxs ?? theme.spacing.xs * 0.5,
    backgroundColor: theme.colors.background.muted,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  previewLabel: {
    color: theme.colors.content.muted,
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.sm,
  },
  previewValue: {
    color: theme.colors.content.primary,
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.sm,
  },
});
