import type { CategoryInference, InferenceConfidence, InferenceResult } from '@domain/common';
import type { ListType } from '@domain/list';

/**
 * Pattern arrays for each list type
 * Each pattern is a regex that matches indicators of that category
 */
const SHOPPING_PATTERNS: RegExp[] = [
  /R\$\s?\d/i,
  /compra[rs]?/i,
  /mercado/i,
  /supermercado/i,
  /\d+\s*(kg|g|l|ml|un|pc|pç|dz|cx)/i,
];

const MOVIE_PATTERNS: RegExp[] = [/assistir/i, /filmes?/i, /cinema/i, /séries?/i, /temporada/i];

const BOOK_PATTERNS: RegExp[] = [/\bler\b/i, /livros?/i, /autore?s?/i, /editora/i, /capítulos?/i];

const GAME_PATTERNS: RegExp[] = [
  /jogar/i,
  /games?/i,
  /jogos?/i,
  /console/i,
  /\b(ps[45]|xbox|switch|pc)\b/i,
];

/**
 * Category Inference Service
 *
 * Infers the most likely list type from text using pattern matching.
 * Uses heuristics to determine the category with confidence levels:
 * - high: 2+ patterns match
 * - medium: 1 pattern matches
 * - low: no patterns match (defaults to notes)
 */
export class CategoryInferenceService implements CategoryInference {
  /**
   * Infer list type from text
   *
   * @param text - Text to analyze
   * @returns Inference result with list type and confidence
   */
  infer(text: string): InferenceResult {
    const scores: Record<ListType, number> = {
      shopping: this.countMatches(text, SHOPPING_PATTERNS),
      movies: this.countMatches(text, MOVIE_PATTERNS),
      books: this.countMatches(text, BOOK_PATTERNS),
      games: this.countMatches(text, GAME_PATTERNS),
      notes: 0,
    };

    const maxScore = Math.max(...Object.values(scores));

    if (maxScore === 0) {
      return { listType: 'notes', confidence: 'low' };
    }

    const winner = this.getWinningCategory(scores, maxScore);
    const confidence = this.calculateConfidence(maxScore);

    return { listType: winner, confidence };
  }

  /**
   * Count how many patterns match in the text
   */
  private countMatches(text: string, patterns: RegExp[]): number {
    return patterns.filter((pattern) => pattern.test(text)).length;
  }

  /**
   * Get the winning category (first one with max score)
   */
  private getWinningCategory(scores: Record<ListType, number>, maxScore: number): ListType {
    const categories: ListType[] = ['shopping', 'movies', 'books', 'games', 'notes'];
    return categories.find((category) => scores[category] === maxScore) ?? 'notes';
  }

  /**
   * Calculate confidence level based on score
   */
  private calculateConfidence(score: number): InferenceConfidence {
    if (score >= 2) {
      return 'high';
    }
    if (score === 1) {
      return 'high';
    }
    return 'low';
  }
}
