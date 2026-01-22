/**
 * GoogleBooksProviderService
 *
 * Media provider service for Google Books API.
 * Provides book search and retrieval with metadata enrichment.
 */

import type {
  MediaProviderRepository,
  MediaSearchResult,
} from '@domain/common/ports/media-provider.port';

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1';

interface GoogleBooksVolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
  };
  language?: string;
  industryIdentifiers?: { type: string; identifier: string }[];
}

interface GoogleBooksVolume {
  id: string;
  volumeInfo: GoogleBooksVolumeInfo;
}

interface GoogleBooksSearchResponse {
  kind: string;
  totalItems: number;
  items?: GoogleBooksVolume[];
}

/**
 * Service for searching and retrieving book data from Google Books API.
 *
 * Optionally uses EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY environment variable.
 * Google Books API works without an API key but has stricter rate limits.
 */
export class GoogleBooksProviderService implements MediaProviderRepository {
  private apiKey: string | undefined;

  constructor() {
    // Access environment variable at runtime
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY;

    if (!this.apiKey) {
      console.debug(
        '[GoogleBooksProviderService] EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY not set - using unauthenticated requests (rate limited)',
      );
    }
  }

  /**
   * Check if the service is available (always available, with or without API key)
   */
  isAvailable(): boolean {
    return true;
  }

  /**
   * Search for books by query
   *
   * @param query - Search query string
   * @returns Array of matching book results
   */
  async search(query: string): Promise<MediaSearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      const url = new URL(`${GOOGLE_BOOKS_BASE_URL}/volumes`);
      url.searchParams.set('q', query.trim());
      url.searchParams.set('maxResults', '20');
      url.searchParams.set('langRestrict', 'pt');
      url.searchParams.set('orderBy', 'relevance');

      if (this.apiKey) {
        url.searchParams.set('key', this.apiKey);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        console.debug(`[GoogleBooksProviderService] Search failed: ${response.status}`);
        return [];
      }

      const data: GoogleBooksSearchResponse = await response.json();

      if (!data.items || data.items.length === 0) {
        return [];
      }

      return data.items.map((volume) => this.mapVolumeToResult(volume));
    } catch (error) {
      console.debug('[GoogleBooksProviderService] Search error:', error);
      return [];
    }
  }

  /**
   * Get a single book by Google Books volume ID
   *
   * @param externalId - Google Books volume ID
   * @returns Book details or null if not found
   */
  async getById(externalId: string): Promise<MediaSearchResult | null> {
    if (!externalId) {
      return null;
    }

    try {
      const url = new URL(`${GOOGLE_BOOKS_BASE_URL}/volumes/${externalId}`);

      if (this.apiKey) {
        url.searchParams.set('key', this.apiKey);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        console.debug(`[GoogleBooksProviderService] GetById failed: ${response.status}`);
        return null;
      }

      const volume: GoogleBooksVolume = await response.json();

      return this.mapVolumeToResult(volume);
    } catch (error) {
      console.debug('[GoogleBooksProviderService] GetById error:', error);
      return null;
    }
  }

  /**
   * Map Google Books volume to MediaSearchResult
   */
  private mapVolumeToResult(volume: GoogleBooksVolume): MediaSearchResult {
    const info = volume.volumeInfo;

    // Extract year from publishedDate (can be "2024", "2024-01", or "2024-01-15")
    const year = info.publishedDate
      ? parseInt(info.publishedDate.substring(0, 4), 10) || null
      : null;

    // Get the best available image URL (prefer larger images)
    const imageUrl = this.getBestImageUrl(info.imageLinks);

    // Get ISBN-13 or ISBN-10 if available
    const isbn = info.industryIdentifiers?.find(
      (id) => id.type === 'ISBN_13' || id.type === 'ISBN_10',
    )?.identifier;

    return {
      externalId: volume.id,
      title: info.subtitle ? `${info.title}: ${info.subtitle}` : info.title,
      description: info.description ?? null,
      imageUrl,
      year,
      metadata: {
        authors: info.authors ?? [],
        publisher: info.publisher,
        pageCount: info.pageCount,
        categories: info.categories ?? [],
        averageRating: info.averageRating,
        ratingsCount: info.ratingsCount,
        language: info.language,
        isbn,
      },
    };
  }

  /**
   * Get the best available image URL from imageLinks
   */
  private getBestImageUrl(imageLinks?: GoogleBooksVolumeInfo['imageLinks']): string | null {
    if (!imageLinks) {
      return null;
    }

    // Prefer larger images, but use what's available
    const url =
      imageLinks.large ??
      imageLinks.medium ??
      imageLinks.small ??
      imageLinks.thumbnail ??
      imageLinks.smallThumbnail ??
      null;

    // Google Books returns http URLs, upgrade to https
    if (url && url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }

    return url;
  }
}
