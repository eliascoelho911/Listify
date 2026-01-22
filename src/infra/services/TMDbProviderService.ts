/**
 * TMDbProviderService
 *
 * Media provider service for TMDb (The Movie Database) API.
 * Provides movie search and retrieval with metadata enrichment.
 */

import type {
  MediaProviderRepository,
  MediaSearchResult,
} from '@domain/common/ports/media-provider.port';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const POSTER_SIZE = 'w500';

interface TMDbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
}

interface TMDbSearchResponse {
  page: number;
  results: TMDbMovie[];
  total_pages: number;
  total_results: number;
}

interface TMDbMovieDetails extends TMDbMovie {
  runtime: number | null;
  genres: { id: number; name: string }[];
  credits?: {
    cast: { id: number; name: string; character: string }[];
  };
}

/**
 * Service for searching and retrieving movie data from TMDb API.
 *
 * Requires EXPO_PUBLIC_TMDB_API_KEY environment variable to be set.
 * Falls back gracefully when API key is not available (returns empty results).
 */
export class TMDbProviderService implements MediaProviderRepository {
  private apiKey: string | undefined;

  constructor() {
    // Access environment variable at runtime
    this.apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;

    if (!this.apiKey) {
      console.debug('[TMDbProviderService] EXPO_PUBLIC_TMDB_API_KEY not set - movie search will be unavailable');
    }
  }

  /**
   * Check if the service is available (API key is configured)
   */
  isAvailable(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Search for movies by query
   *
   * @param query - Search query string
   * @returns Array of matching movie results
   */
  async search(query: string): Promise<MediaSearchResult[]> {
    if (!this.apiKey || !query.trim()) {
      return [];
    }

    try {
      const url = new URL(`${TMDB_BASE_URL}/search/movie`);
      url.searchParams.set('api_key', this.apiKey);
      url.searchParams.set('query', query.trim());
      url.searchParams.set('language', 'pt-BR');
      url.searchParams.set('include_adult', 'false');

      const response = await fetch(url.toString());

      if (!response.ok) {
        console.debug(`[TMDbProviderService] Search failed: ${response.status}`);
        return [];
      }

      const data: TMDbSearchResponse = await response.json();

      return data.results.map((movie) => this.mapMovieToResult(movie));
    } catch (error) {
      console.debug('[TMDbProviderService] Search error:', error);
      return [];
    }
  }

  /**
   * Get a single movie by TMDb ID with full details
   *
   * @param externalId - TMDb movie ID
   * @returns Movie details or null if not found
   */
  async getById(externalId: string): Promise<MediaSearchResult | null> {
    if (!this.apiKey || !externalId) {
      return null;
    }

    try {
      const url = new URL(`${TMDB_BASE_URL}/movie/${externalId}`);
      url.searchParams.set('api_key', this.apiKey);
      url.searchParams.set('language', 'pt-BR');
      url.searchParams.set('append_to_response', 'credits');

      const response = await fetch(url.toString());

      if (!response.ok) {
        console.debug(`[TMDbProviderService] GetById failed: ${response.status}`);
        return null;
      }

      const movie: TMDbMovieDetails = await response.json();

      return this.mapMovieDetailsToResult(movie);
    } catch (error) {
      console.debug('[TMDbProviderService] GetById error:', error);
      return null;
    }
  }

  /**
   * Map TMDb movie search result to MediaSearchResult
   */
  private mapMovieToResult(movie: TMDbMovie): MediaSearchResult {
    return {
      externalId: String(movie.id),
      title: movie.title,
      description: movie.overview,
      imageUrl: movie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZE}${movie.poster_path}`
        : null,
      year: movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : null,
      metadata: {
        originalTitle: movie.original_title,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        popularity: movie.popularity,
        genreIds: movie.genre_ids,
      },
    };
  }

  /**
   * Map TMDb movie details to MediaSearchResult with extended metadata
   */
  private mapMovieDetailsToResult(movie: TMDbMovieDetails): MediaSearchResult {
    const cast = movie.credits?.cast?.slice(0, 5).map((c) => c.name) ?? [];

    return {
      externalId: String(movie.id),
      title: movie.title,
      description: movie.overview,
      imageUrl: movie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZE}${movie.poster_path}`
        : null,
      year: movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : null,
      metadata: {
        originalTitle: movie.original_title,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        popularity: movie.popularity,
        runtime: movie.runtime,
        genres: movie.genres?.map((g) => g.name) ?? [],
        cast,
      },
    };
  }
}
