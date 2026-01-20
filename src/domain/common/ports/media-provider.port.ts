/**
 * Search result from external media provider
 */
export interface MediaSearchResult {
  /** External provider ID */
  externalId: string;

  /** Title of the media */
  title: string;

  /** Description/overview, if available */
  description: string | null;

  /** Image/poster URL, if available */
  imageUrl: string | null;

  /** Release year, if available */
  year: number | null;

  /** Additional provider-specific metadata */
  metadata: Record<string, unknown>;
}

/**
 * Media provider repository interface
 * Used by TMDb, Google Books, and IGDB services
 */
export interface MediaProviderRepository {
  /**
   * Search for media by query
   *
   * @param query - Search query string
   * @returns Array of matching results
   */
  search(query: string): Promise<MediaSearchResult[]>;

  /**
   * Get a single media item by external ID
   *
   * @param externalId - Provider-specific ID
   * @returns Media item or null if not found
   */
  getById(externalId: string): Promise<MediaSearchResult | null>;
}
