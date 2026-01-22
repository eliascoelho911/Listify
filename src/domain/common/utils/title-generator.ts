/**
 * Title Generator Utility
 *
 * Provides automatic title generation for notes.
 * Generates titles based on content or timestamp fallback.
 */

/**
 * Maximum length for auto-generated titles
 */
const MAX_TITLE_LENGTH = 50;

/**
 * Generate an automatic title for a note.
 *
 * Strategy:
 * 1. If description is provided, use first line/sentence (cleaned of markdown)
 * 2. Otherwise, use timestamp-based fallback
 *
 * @param description - Optional note description/content
 * @param locale - Locale for formatting (default: 'pt-BR')
 * @returns Generated title string
 */
export function generateNoteTitle(description?: string, locale = 'pt-BR'): string {
  if (description && description.trim()) {
    return extractTitleFromDescription(description);
  }
  return generateTimestampTitle(locale);
}

/**
 * Extract a title from description content.
 * Cleans markdown and takes first meaningful line.
 *
 * @param description - Note description/content
 * @returns Extracted title
 */
function extractTitleFromDescription(description: string): string {
  // Remove markdown headers (# Title -> Title)
  let cleaned = description.replace(/^#+\s*/gm, '');

  // Remove markdown formatting symbols
  cleaned = cleaned
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/__([^_]+)__/g, '$1') // Bold with underscore
    .replace(/_([^_]+)_/g, '$1') // Italic with underscore
    .replace(/~~([^~]+)~~/g, '$1') // Strikethrough
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Links

  // Get first non-empty line
  const lines = cleaned.split('\n').filter((line) => line.trim());
  if (lines.length === 0) {
    return generateTimestampTitle();
  }

  let title = lines[0].trim();

  // Truncate if too long
  if (title.length > MAX_TITLE_LENGTH) {
    title = title.substring(0, MAX_TITLE_LENGTH - 3) + '...';
  }

  return title;
}

/**
 * Generate a timestamp-based title.
 * Format: "Nota YYYY-MM-DD HH:mm"
 *
 * @param locale - Locale for formatting
 * @returns Timestamp-based title
 */
function generateTimestampTitle(locale = 'pt-BR'): string {
  const now = new Date();

  // Format: "Nota 22/01/2026 14:30"
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDate = dateFormatter.format(now);

  // Use English for the word "Note" in the title (as per CLAUDE.md code naming conventions)
  return `Note ${formattedDate}`;
}
