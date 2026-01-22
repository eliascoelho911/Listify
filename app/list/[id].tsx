/**
 * Dynamic List Route
 *
 * Routes to the appropriate list screen based on the list type.
 * For shopping lists, displays ShoppingListScreen with checkbox and total features.
 */

import React, { type ReactElement, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAppDependencies } from '@app/di';
import type { List } from '@domain/list';
import { InterestListScreen, ShoppingListScreen } from '@presentation/screens';
import { useTheme } from '@design-system/theme';

export default function ListRoute(): ReactElement {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { listRepository } = useAppDependencies();
  const { theme } = useTheme();

  const [list, setList] = useState<List | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadList() {
      if (!id) {
        router.back();
        return;
      }

      try {
        const loadedList = await listRepository.getById(id);
        if (loadedList) {
          setList(loadedList);
        } else {
          console.error('[ListRoute] List not found:', id);
          router.back();
        }
      } catch (error) {
        console.error('[ListRoute] Failed to load list:', error);
        router.back();
      } finally {
        setIsLoading(false);
      }
    }

    loadList();
  }, [id, listRepository, router]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!list) {
    return <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]} />;
  }

  // Route to appropriate screen based on list type
  switch (list.listType) {
    case 'shopping':
      return <ShoppingListScreen />;

    case 'movies':
    case 'books':
    case 'games':
      return <InterestListScreen />;

    case 'notes':
      // Notes use NoteDetailScreen accessed via note/[id].tsx
      console.debug('[ListRoute] Notes list accessed - should use notes tab');
      router.back();
      return <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]} />;

    default:
      return <ShoppingListScreen />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
