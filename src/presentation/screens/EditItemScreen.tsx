import { type ReactElement, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import getSymbolFromCurrency from 'currency-symbol-map';

import { DEFAULT_CURRENCY_CODE, FALLBACK_LOCALE } from '@domain/shopping/constants';
import type { ShoppingItem } from '@domain/shopping/entities/ShoppingItem';
import type { CategoryItems } from '@domain/shopping/use-cases/GetActiveListState';
import { Money } from '@domain/shopping/value-objects/Money';
import { Quantity } from '@domain/shopping/value-objects/Quantity';
import { useShoppingListVM } from '@presentation/hooks/useShoppingListVM';
import { Dropdown } from '@legacy-design-system/components/Dropdown';
import { NumberPicker } from '@legacy-design-system/components/NumberPicker';
import { theme } from '@legacy-design-system/theme/theme';

type EditItemScreenProps = {
  itemId?: string;
};

export default function EditItemScreen({ itemId }: EditItemScreenProps): ReactElement {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const routeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const targetId = itemId ?? routeId;
  const { state, actions } = useShoppingListVM();
  const currencyCode = state.list?.currencyCode ?? DEFAULT_CURRENCY_CODE;
  const locale = i18n.language || FALLBACK_LOCALE;
  const currentInput = useMemo(() => resolveCurrencyPrefix(currencyCode), [currencyCode]);
  const { delimiter, separator } = useMemo(() => resolveNumberSeparators(locale), [locale]);
  const fractionDigits = useMemo(() => resolveFractionDigits(currencyCode), [currencyCode]);

  const item = useMemo(
    () => (targetId ? findItem(state.categories, targetId) : undefined),
    [state.categories, targetId],
  );

  const [name, setName] = useState('');
  const [quantityValue, setQuantityValue] = useState<number>(1);
  const [unit, setUnit] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [unitPriceValue, setUnitPriceValue] = useState<number | null>(null);
  const [totalPriceValue, setTotalPriceValue] = useState<number | null>(null);
  const [lastEditedPriceField, setLastEditedPriceField] = useState<'unit' | 'total' | undefined>(
    undefined,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const unitOptions = useMemo(() => {
    const options = [
      { value: 'un', label: t('units.un') },
      { value: 'kg', label: t('units.kg') },
      { value: 'g', label: t('units.g') },
      { value: 'l', label: t('units.l') },
      { value: 'ml', label: t('units.ml') },
    ];

    if (unit && !options.some((option) => option.value === unit)) {
      return [{ value: unit, label: unit }, ...options];
    }

    return options;
  }, [locale, t, unit]);

  const quantityStep = useMemo(() => resolveQuantityStep(unit), [unit]);
  const quantityMin = useMemo(() => resolveQuantityMin(quantityStep), [quantityStep]);

  const getQuantityValue = (): number | null => {
    try {
      return Quantity.parse(quantityValue).toNumber();
    } catch {
      return null;
    }
  };

  const handleQuantityNumberChanged = (quantity: number): void => {
    setQuantityValue(quantity);
  };

  const handleUnitPriceChange = (unitValue: number | null): void => {
    setUnitPriceValue(unitValue);
    setLastEditedPriceField('unit');
  };

  const handleTotalPriceChange = (totalValue: number | null): void => {
    setTotalPriceValue(totalValue);
    setLastEditedPriceField('total');
  };

  const updateTotalPriceValue = (): void => {
    const unitValue = unitPriceValue;
    if (unitValue === null) {
      setTotalPriceValue(null);
    }

    const quantityValue = getQuantityValue();
    if (quantityValue === null) {
      return;
    }

    try {
      const unitMinor = Money.fromMajor(unitValue ?? 0, currencyCode).toMinor();
      const totalMinor = Math.round(quantityValue * unitMinor);
      setTotalPriceValue(Money.fromMinor(totalMinor, currencyCode).toMajorNumber());
    } catch {}
  };

  const updateUnitPriceValue = (): void => {
    const totalValue = totalPriceValue;
    if (totalValue === null) {
      setUnitPriceValue(null);
    }

    const quantityValue = getQuantityValue();
    if (quantityValue === null) {
      return;
    }

    try {
      const totalMinor = Money.fromMajor(totalValue ?? 0, currencyCode).toMinor();
      const unitMinor = Math.round(totalMinor / quantityValue);
      setUnitPriceValue(Money.fromMinor(unitMinor, currencyCode).toMajorNumber());
    } catch {}
  };

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantityValue(item.quantity.toNumber());
      setUnit(item.unit);
      setCategoryId(item.categoryId);
      setUnitPriceValue(toMajorValue(item.unitPriceMinor, currencyCode));
      setTotalPriceValue(toMajorValue(item.totalPriceMinor, currencyCode));
      setLastEditedPriceField(
        item.totalPriceMinor !== undefined
          ? 'total'
          : item.unitPriceMinor !== undefined
            ? 'unit'
            : undefined,
      );
      setSaveError(null);
    }
  }, [currencyCode, item]);

  useEffect(() => {
    updateTotalPriceValue();
  }, [quantityValue, unitPriceValue]);

  useEffect(() => {
    updateUnitPriceValue();
  }, [totalPriceValue]);

  const handleSave = async (): Promise<void> => {
    if (!targetId) {
      setSaveError(t('screens.editItem.missingId'));
      return;
    }

    let parsedUnitPrice: number | undefined;
    let parsedTotalPrice: number | undefined;
    try {
      parsedUnitPrice = normalizePriceValue(unitPriceValue, currencyCode);
      parsedTotalPrice = normalizePriceValue(totalPriceValue, currencyCode);
    } catch {
      setSaveError(t('screens.editItem.errors.invalidPrice'));
      return;
    }

    const normalizedUnitPrice = parsedUnitPrice ?? null;
    const normalizedTotalPrice = parsedTotalPrice ?? null;
    const priceSource =
      lastEditedPriceField ??
      (normalizedTotalPrice !== null && normalizedUnitPrice === null
        ? 'total'
        : normalizedUnitPrice !== null && normalizedTotalPrice === null
          ? 'unit'
          : undefined);

    setIsSaving(true);
    setSaveError(null);
    const updated = await actions.updateItem({
      itemId: targetId,
      name,
      quantity: quantityValue,
      unit,
      categoryId,
      unitPriceMinor: normalizedUnitPrice,
      totalPriceMinor: normalizedTotalPrice,
      priceSource,
    });
    setIsSaving(false);
    if (updated) {
      router.back();
      return;
    }
    setSaveError(t('shoppingList.errors.write'));
  };

  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.brand[600]} size="large" />
          <Text style={styles.loadingText}>{t('shoppingList.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!targetId || !item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.title}>{t('screens.editItem.notFound.title')}</Text>
          <Text style={styles.subtitle}>{t('screens.editItem.notFound.subtitle')}</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryButtonText}>{t('screens.editItem.back')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{t('screens.editItem.title')}</Text>
          <Text style={styles.subtitle}>{t('screens.editItem.selectedId', { id: item.id })}</Text>

          <View style={styles.field}>
            <Text style={styles.label}>{t('screens.editItem.fields.name')}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('screens.editItem.fields.namePlaceholder')}
              placeholderTextColor={theme.colors.content.muted}
              style={styles.input}
            />
          </View>

          <View style={styles.inlineRow}>
            <View style={[styles.field, styles.inlineField]}>
              <Text style={styles.label}>{t('screens.editItem.fields.quantity')}</Text>
              <NumberPicker
                value={quantityValue}
                onValueChange={handleQuantityNumberChanged}
                step={quantityStep}
                min={quantityMin}
                locale={locale}
                accessibilityLabel={t('screens.editItem.fields.quantity')}
                decrementLabel={t('screens.editItem.fields.quantityDecrease')}
                incrementLabel={t('screens.editItem.fields.quantityIncrease')}
                style={styles.numberPicker}
              />
            </View>
            <View style={[styles.field, styles.inlineField]}>
              <Text style={styles.label}>{t('screens.editItem.fields.unit')}</Text>
              <Dropdown
                value={unit || null}
                options={unitOptions}
                onValueChange={setUnit}
                placeholder={t('screens.editItem.fields.unitPlaceholder')}
                accessibilityLabel={t('screens.editItem.fields.unit')}
              />
            </View>
          </View>

          <View style={styles.inlineRow}>
            <View style={[styles.field, styles.inlineField]}>
              <Text style={styles.label}>{t('screens.editItem.fields.unitPrice')}</Text>
              <CurrencyInput
                value={unitPriceValue}
                onChangeValue={handleUnitPriceChange}
                keyboardType="decimal-pad"
                placeholder={t('screens.editItem.fields.unitPricePlaceholder', {
                  currency: currentInput,
                })}
                prefix={currentInput}
                placeholderTextColor={theme.colors.content.muted}
                delimiter={delimiter}
                separator={separator}
                precision={fractionDigits}
                style={styles.input}
              />
            </View>
            <View style={[styles.field, styles.inlineField]}>
              <Text style={styles.label}>{t('screens.editItem.fields.totalPrice')}</Text>
              <CurrencyInput
                value={totalPriceValue}
                onChangeValue={handleTotalPriceChange}
                keyboardType="decimal-pad"
                placeholder={t('screens.editItem.fields.totalPricePlaceholder', {
                  currency: currentInput,
                })}
                prefix={currentInput}
                placeholderTextColor={theme.colors.content.muted}
                delimiter={delimiter}
                separator={separator}
                precision={fractionDigits}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('screens.editItem.fields.category')}</Text>
            <View style={styles.categories}>
              {state.categories.map((category) => {
                const isSelected = category.id === categoryId;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => setCategoryId(category.id)}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                      pressed && styles.categoryChipPressed,
                    ]}
                  >
                    <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                      {formatCategoryLabel(category, t)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

          <View style={styles.actions}>
            <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
              <Text style={styles.secondaryButtonText}>{t('screens.editItem.cancel')}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                isSaving && styles.primaryButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.primaryButtonText}>
                {isSaving ? t('screens.editItem.saving') : t('screens.editItem.save')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function findItem(categories: CategoryItems[], itemId: string): ShoppingItem | undefined {
  for (const category of categories) {
    const pending = category.items.pending.find((candidate) => candidate.id === itemId);
    if (pending) {
      return pending;
    }
    const purchased = category.items.purchased.find((candidate) => candidate.id === itemId);
    if (purchased) {
      return purchased;
    }
  }
  return undefined;
}

function formatCategoryLabel(
  category: CategoryItems,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  const normalized = category.name.trim().toLowerCase();
  return t(`categories.${normalized}`, { defaultValue: category.name }) || category.name;
}

function resolveNumberSeparators(locale: string): { delimiter: string; separator: string } {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(1000.1);
    const delimiter = parts.find((part) => part.type === 'group')?.value ?? '.';
    const separator = parts.find((part) => part.type === 'decimal')?.value ?? ',';
    return { delimiter, separator };
  } catch {
    if (locale !== FALLBACK_LOCALE) {
      return resolveNumberSeparators(FALLBACK_LOCALE);
    }
    return { delimiter: '.', separator: ',' };
  }
}

function resolveCurrencyPrefix(currencyCode: string): string {
  const normalized = currencyCode.trim().toUpperCase();
  const symbol = getSymbolFromCurrency(normalized);
  if (symbol) {
    return `${symbol} `;
  }
  return `${normalized} `;
}

function resolveFractionDigits(currencyCode: string): number {
  try {
    return Money.fromMinor(0, currencyCode).getFractionDigits();
  } catch {
    return 2;
  }
}

function resolveQuantityStep(unitCode: string): number {
  const normalized = unitCode.trim().toLowerCase();
  if (normalized === 'kg' || normalized === 'l') {
    return 1.0;
  }
  return 1.0;
}

function resolveQuantityMin(step: number): number {
  if (!Number.isFinite(step) || step <= 0) {
    return 1;
  }
  return step;
}

function normalizePriceValue(value: number | null, currencyCode: string): number | undefined {
  if (value === null) {
    return undefined;
  }
  if (!Number.isFinite(value)) {
    throw new Error('Invalid price value.');
  }
  return Money.fromMajor(value, currencyCode).toMinor();
}

function toMajorValue(value: number | undefined, currencyCode: string): number | null {
  if (value === undefined) {
    return null;
  }
  return Money.fromMinor(value, currencyCode).toMajorNumber();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.canvas,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  loadingText: {
    fontFamily: theme.typography.families.body,
    color: theme.colors.content.secondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.families.heading,
    fontSize: theme.typography.sizes.xl,
    lineHeight: theme.typography.sizes.xl * theme.typography.lineHeights.tight,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.content.primary,
  },
  subtitle: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.normal,
    color: theme.colors.content.secondary,
  },
  field: {
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
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.content.primary,
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
  },
  numberPicker: {
    alignSelf: 'stretch',
  },
  inlineRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  inlineField: {
    flex: 1,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border.muted,
    backgroundColor: theme.colors.background.surface,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.brand[50],
    borderColor: theme.colors.brand[400],
  },
  categoryChipPressed: {
    backgroundColor: theme.colors.background.muted,
  },
  categoryText: {
    fontFamily: theme.typography.families.body,
    color: theme.colors.content.primary,
  },
  categoryTextSelected: {
    color: theme.colors.brand[700],
    fontWeight: theme.typography.weights.semibold,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
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
  secondaryButtonText: {
    fontFamily: theme.typography.families.heading,
    color: theme.colors.content.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  errorText: {
    color: theme.colors.danger[700],
    fontFamily: theme.typography.families.body,
  },
});
