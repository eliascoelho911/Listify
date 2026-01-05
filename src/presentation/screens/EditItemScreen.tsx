import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import type { ShoppingItem } from '@domain/shopping/entities/ShoppingItem';
import type { CategoryItems } from '@domain/shopping/use-cases/GetActiveListState';
import { useShoppingListVM } from '@presentation/hooks/useShoppingListVM';
import { theme } from '@design-system/theme/theme';

type EditItemScreenProps = {
  itemId?: string;
};

export default function EditItemScreen({ itemId }: EditItemScreenProps): ReactElement {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const routeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const targetId = itemId ?? routeId;
  const { state, actions } = useShoppingListVM();

  const item = useMemo(
    () => (targetId ? findItem(state.categories, targetId) : undefined),
    [state.categories, targetId],
  );

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity.toString());
      setUnit(item.unit);
      setCategoryId(item.categoryId);
      setSaveError(null);
    }
  }, [item]);

  const handleSave = async (): Promise<void> => {
    if (!targetId) {
      setSaveError(t('screens.editItem.missingId'));
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    const updated = await actions.updateItem({
      itemId: targetId,
      name,
      quantity,
      unit,
      categoryId,
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
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                placeholder={t('screens.editItem.fields.quantityPlaceholder')}
                placeholderTextColor={theme.colors.content.muted}
                style={styles.input}
              />
            </View>
            <View style={[styles.field, styles.inlineField]}>
              <Text style={styles.label}>{t('screens.editItem.fields.unit')}</Text>
              <TextInput
                value={unit}
                onChangeText={setUnit}
                placeholder={t('screens.editItem.fields.unitPlaceholder')}
                placeholderTextColor={theme.colors.content.muted}
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
