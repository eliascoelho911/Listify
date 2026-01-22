/**
 * IGDBProviderService
 *
 * Media provider service for IGDB (Internet Game Database) API via Twitch OAuth.
 * Provides game search and retrieval with metadata enrichment.
 *
 * Requires both EXPO_PUBLIC_TWITCH_CLIENT_ID and EXPO_PUBLIC_TWITCH_CLIENT_SECRET
 * environment variables to be set for authentication.
 */

import type {
  MediaProviderRepository,
  MediaSearchResult,
} from '@domain/common/ports/media-provider.port';

const IGDB_BASE_URL = 'https://api.igdb.com/v4';
const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const IGDB_IMAGE_BASE_URL = 'https://images.igdb.com/igdb/image/upload';

interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  first_release_date?: number;
  cover?: {
    id: number;
    image_id: string;
  };
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  genres?: { id: number; name: string }[];
  platforms?: { id: number; name: string; abbreviation?: string }[];
  involved_companies?: {
    id: number;
    company: { id: number; name: string };
    developer: boolean;
    publisher: boolean;
  }[];
  game_modes?: { id: number; name: string }[];
  themes?: { id: number; name: string }[];
  total_rating?: number;
}

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Service for searching and retrieving game data from IGDB API.
 *
 * Requires EXPO_PUBLIC_TWITCH_CLIENT_ID and EXPO_PUBLIC_TWITCH_CLIENT_SECRET
 * environment variables to be set.
 * Falls back gracefully when credentials are not available (returns empty results).
 */
export class IGDBProviderService implements MediaProviderRepository {
  private clientId: string | undefined;
  private clientSecret: string | undefined;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    // Access environment variables at runtime
    this.clientId = process.env.EXPO_PUBLIC_TWITCH_CLIENT_ID;
    this.clientSecret = process.env.EXPO_PUBLIC_TWITCH_CLIENT_SECRET;

    if (!this.clientId || !this.clientSecret) {
      console.debug(
        '[IGDBProviderService] EXPO_PUBLIC_TWITCH_CLIENT_ID and/or EXPO_PUBLIC_TWITCH_CLIENT_SECRET not set - game search will be unavailable',
      );
    }
  }

  /**
   * Check if the service is available (credentials are configured)
   */
  isAvailable(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }

  /**
   * Search for games by query
   *
   * @param query - Search query string
   * @returns Array of matching game results
   */
  async search(query: string): Promise<MediaSearchResult[]> {
    if (!this.isAvailable() || !query.trim()) {
      return [];
    }

    try {
      const token = await this.getAccessToken();
      if (!token) {
        return [];
      }

      const response = await fetch(`${IGDB_BASE_URL}/games`, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId!,
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'text/plain',
        },
        body: `
          search "${query.trim().replace(/"/g, '\\"')}";
          fields name, summary, first_release_date, cover.image_id, rating, rating_count,
                 genres.name, platforms.name, platforms.abbreviation,
                 involved_companies.company.name, involved_companies.developer, involved_companies.publisher;
          limit 20;
        `.trim(),
      });

      if (!response.ok) {
        console.debug(`[IGDBProviderService] Search failed: ${response.status}`);
        return [];
      }

      const games: IGDBGame[] = await response.json();

      return games.map((game) => this.mapGameToResult(game));
    } catch (error) {
      console.debug('[IGDBProviderService] Search error:', error);
      return [];
    }
  }

  /**
   * Get a single game by IGDB ID with full details
   *
   * @param externalId - IGDB game ID
   * @returns Game details or null if not found
   */
  async getById(externalId: string): Promise<MediaSearchResult | null> {
    if (!this.isAvailable() || !externalId) {
      return null;
    }

    try {
      const token = await this.getAccessToken();
      if (!token) {
        return null;
      }

      const response = await fetch(`${IGDB_BASE_URL}/games`, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId!,
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'text/plain',
        },
        body: `
          where id = ${externalId};
          fields name, summary, first_release_date, cover.image_id, rating, rating_count,
                 aggregated_rating, aggregated_rating_count, total_rating,
                 genres.name, platforms.name, platforms.abbreviation,
                 involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
                 game_modes.name, themes.name;
          limit 1;
        `.trim(),
      });

      if (!response.ok) {
        console.debug(`[IGDBProviderService] GetById failed: ${response.status}`);
        return null;
      }

      const games: IGDBGame[] = await response.json();

      if (games.length === 0) {
        return null;
      }

      return this.mapGameDetailsToResult(games[0]);
    } catch (error) {
      console.debug('[IGDBProviderService] GetById error:', error);
      return null;
    }
  }

  /**
   * Get OAuth access token from Twitch, with caching
   */
  private async getAccessToken(): Promise<string | null> {
    // Return cached token if still valid (with 5 minute buffer)
    if (this.accessToken && Date.now() < this.tokenExpiry - 300000) {
      return this.accessToken;
    }

    try {
      const url = new URL(TWITCH_TOKEN_URL);
      url.searchParams.set('client_id', this.clientId!);
      url.searchParams.set('client_secret', this.clientSecret!);
      url.searchParams.set('grant_type', 'client_credentials');

      const response = await fetch(url.toString(), {
        method: 'POST',
      });

      if (!response.ok) {
        console.debug(`[IGDBProviderService] Token request failed: ${response.status}`);
        return null;
      }

      const data: TwitchTokenResponse = await response.json();

      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000;

      return this.accessToken;
    } catch (error) {
      console.debug('[IGDBProviderService] Token error:', error);
      return null;
    }
  }

  /**
   * Map IGDB game search result to MediaSearchResult
   */
  private mapGameToResult(game: IGDBGame): MediaSearchResult {
    return {
      externalId: String(game.id),
      title: game.name,
      description: game.summary ?? null,
      imageUrl: game.cover?.image_id
        ? `${IGDB_IMAGE_BASE_URL}/t_cover_big/${game.cover.image_id}.jpg`
        : null,
      year: game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : null,
      metadata: {
        rating: game.rating,
        ratingCount: game.rating_count,
        genres: game.genres?.map((g) => g.name) ?? [],
        platforms: game.platforms?.map((p) => p.abbreviation ?? p.name) ?? [],
        developer: this.extractDeveloper(game),
        publisher: this.extractPublisher(game),
      },
    };
  }

  /**
   * Map IGDB game details to MediaSearchResult with extended metadata
   */
  private mapGameDetailsToResult(game: IGDBGame): MediaSearchResult {
    return {
      externalId: String(game.id),
      title: game.name,
      description: game.summary ?? null,
      imageUrl: game.cover?.image_id
        ? `${IGDB_IMAGE_BASE_URL}/t_cover_big/${game.cover.image_id}.jpg`
        : null,
      year: game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : null,
      metadata: {
        rating: game.rating,
        ratingCount: game.rating_count,
        aggregatedRating: game.aggregated_rating,
        aggregatedRatingCount: game.aggregated_rating_count,
        totalRating: game.total_rating,
        genres: game.genres?.map((g) => g.name) ?? [],
        platforms: game.platforms?.map((p) => p.abbreviation ?? p.name) ?? [],
        developer: this.extractDeveloper(game),
        publisher: this.extractPublisher(game),
        gameModes: game.game_modes?.map((m) => m.name) ?? [],
        themes: game.themes?.map((t) => t.name) ?? [],
      },
    };
  }

  /**
   * Extract developer company name from involved_companies
   */
  private extractDeveloper(game: IGDBGame): string | undefined {
    const developer = game.involved_companies?.find((ic) => ic.developer);
    return developer?.company?.name;
  }

  /**
   * Extract publisher company name from involved_companies
   */
  private extractPublisher(game: IGDBGame): string | undefined {
    const publisher = game.involved_companies?.find((ic) => ic.publisher);
    return publisher?.company?.name;
  }
}
