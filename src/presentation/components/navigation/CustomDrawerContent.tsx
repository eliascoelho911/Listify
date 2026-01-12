/**
 * CustomDrawerContent
 *
 * Custom drawer content with branding and navigation items.
 */

import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import {
  DrawerContentScrollView as DrawerScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import { Logo } from '@design-system/atoms';
import { useTheme } from '@design-system/theme';

export function CustomDrawerContent(props: DrawerContentComponentProps): ReactElement {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    content: {
      flex: 1,
      paddingTop: theme.spacing.md,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo size="lg" />
      </View>
      <DrawerScrollView {...props} contentContainerStyle={styles.content} scrollEnabled={false}>
        <DrawerItemList {...props} />
      </DrawerScrollView>
    </View>
  );
}
