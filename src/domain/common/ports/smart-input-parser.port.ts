/**
 * Highlight for visual marking in input field
 */
export interface Highlight {
  /** Type of highlighted element */
  type: 'list' | 'section' | 'price' | 'quantity';

  /** Start position in original text (0-indexed) */
  start: number;

  /** End position in original text (exclusive) */
  end: number;

  /** Highlighted text value */
  value: string;
}

/**
 * Result of smart input parsing
 */
export interface ParsedInput {
  /** Extracted title (text after removing parseable elements) */
  title: string;

  /** Referenced list name (@list), or null if not specified */
  listName: string | null;

  /** Referenced section name (@list:section or :section), or null if not specified */
  sectionName: string | null;

  /** Extracted quantity (e.g., "2kg", "500ml"), or null if not present */
  quantity: string | null;

  /** Extracted monetary value, or null if not present */
  price: number | null;

  /** Original unmodified text */
  rawText: string;

  /** Positions for inline highlighting */
  highlights: Highlight[];
}

/**
 * Optional context for parsing
 */
export interface ParseContext {
  /** Current list (for :section syntax) */
  currentListName?: string;

  /** Whether target list is shopping type (enables price extraction) */
  isShoppingList?: boolean;
}

/**
 * Smart input parser service interface
 */
export interface SmartInputParser {
  /**
   * Parse smart input text
   *
   * @param text - User input text
   * @param context - Optional context (current list, list type)
   * @returns Structured parsing result
   */
  parse(text: string, context?: ParseContext): ParsedInput;
}
