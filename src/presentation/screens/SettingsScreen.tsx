/**
 * SettingsScreen Presentation Component
 *
 * Placeholder screen for user settings and preferences
 */

import React, { type ReactElement } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

import { Text } from '@design-system/atoms';
import { Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

export function SettingsScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = (): void => {
    router.back();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
      }}
    >
      <Navbar
        title="Settings"
        leftAction={{
          icon: ChevronLeft,
          onPress: handleBack,
          label: 'Go back',
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing.lg,
        }}
      >
        <Text variant="h3" color="muted">
          Settings coming soon
        </Text>
        <Text variant="body" color="muted" style={{ marginTop: theme.spacing.sm }}>
          Theme, preferences and account settings will be here
        </Text>
      </View>
    </View>
  );
}
