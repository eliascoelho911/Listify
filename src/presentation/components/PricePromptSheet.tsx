import { type ReactElement, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '@legacy-design-system/theme/theme';

import { parsePriceInput } from '@presentation/utils/price';

export type PricePromptResult = {
  unitPriceMinor?: number;
  totalPriceMinor?: number;
  priceSource?: 'unit' | 'total';
};

type PricePromptSheetProps = {
  visible: boolean;
  itemName: string;
  quantity: number;
  currencyCode: string;
  locale: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onSubmit: (result: PricePromptResult) => void;
  onSkip: () => void;
};

export function PricePromptSheet({
  visible,
  itemName,
  quantity,
  currencyCode,
  locale,
  isSubmitting = false,
  errorMessage,
  onSubmit,
  onSkip,
}: PricePromptSheetProps): ReactElement | null {
  const { t } = useTranslation();
  const [unitPrice, setUnitPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [lastEdited, setLastEdited] = useState<'unit' | 'total' | undefined>(undefined);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setUnitPrice('');
      setTotalPrice('');
      setLastEdited(undefined);
      setLocalError(null);
    }
  }, [visible, currencyCode]);

  const formattedQuantity = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale).format(quantity);
    } catch {
      return quantity.toString();
    }
  }, [locale, quantity]);

  const combinedError = localError ?? errorMessage;

  if (!visible) {
    return null;
  }

  const handleSave = (): void => {
    try {
      const parsedUnit = parsePriceInput(unitPrice, currencyCode);
      const parsedTotal = parsePriceInput(totalPrice, currencyCode);

      if (parsedUnit === undefined && parsedTotal === undefined) {
        setLocalError(t('shoppingList.pricePrompt.missingPrice'));
        return;
      }

      const priceSource = lastEdited ?? (parsedTotal !== undefined ? 'total' : 'unit');
      setLocalError(null);
      onSubmit({
        unitPriceMinor: parsedUnit,
        totalPriceMinor: parsedTotal,
        priceSource,
      });
    } catch {
      setLocalError(t('shoppingList.pricePrompt.invalidPrice'));
    }
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onSkip}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onSkip} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{t('shoppingList.pricePrompt.title')}</Text>
          <Text style={styles.subtitle}>
            {t('shoppingList.pricePrompt.description', { name: itemName })}
          </Text>
          <Text style={styles.helper}>
            {t('shoppingList.pricePrompt.quantity', {
              quantity: formattedQuantity,
            })}{' '}
            • {t('shoppingList.pricePrompt.currency', { currency: currencyCode })}
          </Text>

          <View style={styles.inputRow}>
            <View style={styles.field}>
              <Text style={styles.label}>{t('shoppingList.pricePrompt.unitPrice')}</Text>
              <TextInput
                value={unitPrice}
                onChangeText={(text) => {
                  setUnitPrice(text);
                  setLastEdited('unit');
                }}
                keyboardType="decimal-pad"
                placeholder={t('shoppingList.pricePrompt.unitPricePlaceholder', {
                  currency: currencyCode,
                })}
                placeholderTextColor={theme.colors.content.muted}
                style={styles.input}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>{t('shoppingList.pricePrompt.totalPrice')}</Text>
              <TextInput
                value={totalPrice}
                onChangeText={(text) => {
                  setTotalPrice(text);
                  setLastEdited('total');
                }}
                keyboardType="decimal-pad"
                placeholder={t('shoppingList.pricePrompt.totalPricePlaceholder', {
                  currency: currencyCode,
                })}
                placeholderTextColor={theme.colors.content.muted}
                style={styles.input}
              />
            </View>
          </View>

          {combinedError ? <Text style={styles.errorText}>{combinedError}</Text> : null}

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
              onPress={onSkip}
            >
              <Text style={styles.secondaryButtonText}>{t('shoppingList.pricePrompt.skip')}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                isSubmitting && styles.primaryButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isSubmitting}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting
                  ? t('shoppingList.pricePrompt.saving')
                  : t('shoppingList.pricePrompt.save')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: theme.colors.background.surface,
    borderTopLeftRadius: theme.radii.xl ?? theme.radii.lg,
    borderTopRightRadius: theme.radii.xl ?? theme.radii.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.content.primary,
  },
  subtitle: {
    fontFamily: theme.typography.families.body,
    color: theme.colors.content.secondary,
    fontSize: theme.typography.sizes.md,
  },
  helper: {
    fontFamily: theme.typography.families.body,
    color: theme.colors.content.muted,
  },
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  field: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  label: {
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.content.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.muted,
    backgroundColor: theme.colors.background.muted,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.content.primary,
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
  },
  errorText: {
    color: theme.colors.danger[700],
    fontFamily: theme.typography.families.body,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.brand[600],
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  primaryButtonPressed: {
    backgroundColor: theme.colors.brand[700],
  },
  primaryButtonDisabled: {
    backgroundColor: theme.colors.border.muted,
  },
  primaryButtonText: {
    fontFamily: theme.typography.families.heading,
    color: theme.colors.content.inverse,
    fontWeight: theme.typography.weights.semibold,
  },
  secondaryButton: {
    backgroundColor: theme.colors.background.muted,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  secondaryButtonPressed: {
    backgroundColor: theme.colors.border.subtle,
  },
  secondaryButtonText: {
    fontFamily: theme.typography.families.heading,
    color: theme.colors.content.primary,
    fontWeight: theme.typography.weights.semibold,
  },
});
