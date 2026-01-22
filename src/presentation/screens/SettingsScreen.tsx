/**
 * SettingsScreen Presentation Component
 *
 * Allows users to configure theme (light/dark/auto) and accent color.
 * Integrates with ThemeProvider for theme changes and UserPreferencesStore
 * for persistence to the database.
 */

import React, { type ReactElement, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

import { Text } from '@design-system/atoms';
import { ColorPicker, ThemeSelector } from '@design-system/molecules';
import type { ColorOption } from '@design-system/molecules/ColorPicker/ColorPicker.types';
import type { ThemeOption } from '@design-system/molecules/ThemeSelector/ThemeSelector.types';
import { Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

/**
 * Predefined accent colors available for selection
 */
const ACCENT_COLORS: ColorOption[] = [
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f97316', label: 'Orange' },
  { value: '#eab308', label: 'Yellow' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#a855f7', label: 'Violet' },
];

export function SettingsScreen(): ReactElement {
  const { theme, mode, setTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  // Currently selected accent color (default is cyan - the primary color)
  // In a full implementation, this would come from UserPreferencesStore
  const selectedColor = useMemo(() => {
    // Default to cyan (the design system primary color)
    return '#06b6d4';
  }, []);

  const handleBack = useCallback((): void => {
    router.back();
  }, [router]);

  const handleThemeSelect = useCallback(
    (themeOption: ThemeOption): void => {
      setTheme(themeOption);
      console.debug('[SettingsScreen] Theme changed to:', themeOption);
    },
    [setTheme],
  );

  const handleColorSelect = useCallback((color: string): void => {
    // In a full implementation, this would update UserPreferencesStore
    // and potentially update the theme's primary color
    console.debug('[SettingsScreen] Color selected:', color);
    // TODO: Implement dynamic primary color when color customization is fully supported
  }, []);

  const styles = useMemo(
    () => ({
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
      },
      scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: insets.bottom + theme.spacing.xl,
      },
      section: {
        marginBottom: theme.spacing.xl,
      },
      sectionTitle: {
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.typography.families.body,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.mutedForeground,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.5,
        marginBottom: theme.spacing.md,
      },
      sectionDescription: {
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.typography.families.body,
        color: theme.colors.mutedForeground,
        marginBottom: theme.spacing.md,
      },
      colorPickerContainer: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.sm,
      },
    }),
    [theme, insets],
  );

  return (
    <View style={styles.container}>
      <Navbar
        title={t('settings.title')}
        leftAction={{
          icon: ChevronLeft,
          onPress: handleBack,
          label: 'Go back',
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.theme.title')}</Text>
          <ThemeSelector
            selectedTheme={mode as ThemeOption}
            onSelect={handleThemeSelect}
            testID="settings-theme-selector"
          />
        </View>

        {/* Accent Color Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.color.title')}</Text>
          <Text style={styles.sectionDescription}>{t('settings.color.description')}</Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              colors={ACCENT_COLORS}
              selectedColor={selectedColor}
              onSelect={handleColorSelect}
              testID="settings-color-picker"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
