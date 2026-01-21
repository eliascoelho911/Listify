/**
 * Notes Tab Screen
 *
 * Single prefabricated notes list with configurable layout.
 * This is a placeholder implementation that will be replaced by US3.3.
 */

import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';

import { Text } from '@design-system/atoms';
import { Navbar } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

export default function NotesScreen(): ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleProfilePress = (): void => {
    router.push('/settings');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    description: {
      marginTop: theme.spacing.sm,
      textAlign: 'center',
    },
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Navbar
        title="Notas"
        rightActions={[
          {
            icon: User,
            onPress: handleProfilePress,
            label: 'Profile settings',
          },
        ]}
      />
      <View style={styles.content}>
        <Text variant="heading">Notas</Text>
        <Text variant="body" color="muted" style={styles.description}>
          Your personal notes with markdown support.
        </Text>
      </View>
    </View>
  );
}
