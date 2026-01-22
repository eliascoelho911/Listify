/**
 * MediaSearchDropdown Molecule Component
 *
 * Displays a dropdown with media search results from external providers (TMDb, Google Books, IGDB).
 * Shows loading state, results with images, and option for manual entry.
 */

import React, { type ReactElement } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, View } from 'react-native';
import { Book, Film, Gamepad2, Plus } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createMediaSearchDropdownStyles } from './MediaSearchDropdown.styles';
import type { MediaSearchDropdownProps, MediaType } from './MediaSearchDropdown.types';

const MEDIA_TYPE_ICONS: Record<MediaType, typeof Film> = {
  movie: Film,
  book: Book,
  game: Gamepad2,
};

const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  movie: 'filme',
  book: 'livro',
  game: 'jogo',
};

export function MediaSearchDropdown({
  results,
  onSelectResult,
  mediaType,
  visible,
  isLoading = false,
  searchQuery,
  onManualEntry,
  showManualOption = true,
  style,
  maxResults = 5,
  errorMessage,
  ...viewProps
}: MediaSearchDropdownProps): ReactElement {
  const { theme } = useTheme();
  const styles = createMediaSearchDropdownStyles(theme);

  if (!visible) {
    return <View style={[styles.container, styles.hidden]} {...viewProps} />;
  }

  const displayedResults = results.slice(0, maxResults);
  const hasResults = displayedResults.length > 0;
  const showManual = showManualOption && searchQuery && onManualEntry;
  const MediaIcon = MEDIA_TYPE_ICONS[mediaType];
  const mediaLabel = MEDIA_TYPE_LABELS[mediaType];

  return (
    <View style={[styles.container, style]} {...viewProps}>
      <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Buscando {mediaLabel}s...</Text>
          </View>
        )}

        {errorMessage && !isLoading && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        {!isLoading && !errorMessage && !hasResults && searchQuery && (
          <Text style={styles.emptyText}>
            Nenhum {mediaLabel} encontrado para "{searchQuery}"
          </Text>
        )}

        {!isLoading &&
          !errorMessage &&
          displayedResults.map((result, index) => (
            <React.Fragment key={result.externalId}>
              {index > 0 && <View style={styles.separator} />}
              <Pressable
                style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
                onPress={() => onSelectResult(result)}
                accessibilityRole="button"
                accessibilityLabel={`Selecionar ${result.title}${result.year ? ` (${result.year})` : ''}`}
              >
                {result.imageUrl ? (
                  <Image
                    source={{ uri: result.imageUrl }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.itemImagePlaceholder}>
                    <Icon
                      icon={MediaIcon}
                      size="lg"
                      color={theme.colors.mutedForeground}
                    />
                  </View>
                )}
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {result.title}
                  </Text>
                  {result.year && (
                    <Text style={styles.itemYear}>{result.year}</Text>
                  )}
                  {result.description && (
                    <Text style={styles.itemDescription} numberOfLines={2}>
                      {result.description}
                    </Text>
                  )}
                </View>
              </Pressable>
            </React.Fragment>
          ))}

        {showManual && !isLoading && (
          <Pressable
            style={({ pressed }) => [styles.manualItem, pressed && styles.itemPressed]}
            onPress={() => onManualEntry(searchQuery)}
            accessibilityRole="button"
            accessibilityLabel={`Adicionar ${searchQuery} manualmente`}
          >
            <View style={styles.manualItemIcon}>
              <Icon icon={Plus} size="lg" color={theme.colors.primary} />
            </View>
            <Text style={styles.manualItemText}>
              Adicionar <Text style={styles.manualItemTitle}>"{searchQuery}"</Text> manualmente
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
