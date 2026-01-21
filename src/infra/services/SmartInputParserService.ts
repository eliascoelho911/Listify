import type {
  Highlight,
  ParseContext,
  ParsedInput,
  SmartInputParser,
} from '@domain/common';

/**
 * Regex pattern for list reference: @listName or @listName:sectionName
 * Captures: [1] = list name, [2] = section name (optional)
 */
const LIST_SECTION_PATTERN = /@([^\s:@]+)(?::([^\s@]+))?/;

/**
 * Regex pattern for standalone section reference: :sectionName (must be at start or after space)
 * Captures: [1] = section name
 */
const STANDALONE_SECTION_PATTERN = /(?:^|\s):([^\s@]+)/;

/**
 * Regex pattern for price: R$X or R$ X with optional decimals
 * Accepts: R$10, R$ 10, R$10,50, R$10.50
 * Captures: [1] = number with optional decimals
 */
const PRICE_PATTERN = /R\$\s?(\d+(?:[.,]\d{1,2})?)/i;

/**
 * Regex pattern for quantity: number followed by unit
 * Accepts: 5kg, 500g, 2L, 500ml, 12un, 6pc, 3pç, 1dz, 2cx
 * Also accepts space between number and unit: "2 kg"
 * Captures: [0] = full match
 */
const QUANTITY_PATTERN = /(\d+(?:[.,]\d+)?)\s?(kg|g|l|ml|un|pc|pç|dz|cx)/i;

/**
 * Smart Input Parser Service
 *
 * Parses user input text to extract:
 * - List reference (@list)
 * - Section reference (@list:section or :section)
 * - Price (R$X,XX) - only when isShoppingList context is true
 * - Quantity (Xkg, Xg, XL, etc.)
 * - Title (remaining text)
 */
export class SmartInputParserService implements SmartInputParser {
  parse(text: string, context?: ParseContext): ParsedInput {
    const highlights: Highlight[] = [];
    let workingText = text;

    let listName: string | null = null;
    let sectionName: string | null = null;
    let price: number | null = null;
    let quantity: string | null = null;

    // 1. Extract list and/or section reference (@lista:seção or @lista)
    const listSectionMatch = LIST_SECTION_PATTERN.exec(text);
    if (listSectionMatch) {
      listName = listSectionMatch[1];
      sectionName = listSectionMatch[2] || null;

      const fullMatch = listSectionMatch[0];
      const start = listSectionMatch.index;
      const end = start + fullMatch.length;

      highlights.push({
        type: 'list',
        start,
        end,
        value: fullMatch,
      });

      workingText = workingText.replace(fullMatch, ' ');
    }

    // 2. Extract standalone section reference (:seção) if no list was found
    if (!listSectionMatch) {
      const standaloneSectionMatch = STANDALONE_SECTION_PATTERN.exec(text);
      if (standaloneSectionMatch) {
        sectionName = standaloneSectionMatch[1];

        // Find the actual :sectionName part for highlighting
        const colonIndex = text.indexOf(':' + sectionName);
        if (colonIndex !== -1) {
          const highlightValue = ':' + sectionName;
          highlights.push({
            type: 'section',
            start: colonIndex,
            end: colonIndex + highlightValue.length,
            value: highlightValue,
          });

          workingText = workingText.replace(highlightValue, ' ');
        }
      }
    }

    // 3. Extract price (only if isShoppingList context is true)
    if (context?.isShoppingList === true) {
      const priceMatch = PRICE_PATTERN.exec(text);
      if (priceMatch) {
        const numericValue = priceMatch[1].replace(',', '.');
        price = parseFloat(numericValue);

        const fullMatch = priceMatch[0];
        const start = priceMatch.index;
        const end = start + fullMatch.length;

        highlights.push({
          type: 'price',
          start,
          end,
          value: fullMatch,
        });

        workingText = workingText.replace(fullMatch, ' ');
      }
    }

    // 4. Extract quantity
    const quantityMatch = QUANTITY_PATTERN.exec(text);
    if (quantityMatch) {
      quantity = quantityMatch[0];

      const start = quantityMatch.index;
      const end = start + quantity.length;

      highlights.push({
        type: 'quantity',
        start,
        end,
        value: quantity,
      });

      workingText = workingText.replace(quantity, ' ');
    }

    // 5. Extract title (remaining text after removing all patterns)
    const title = workingText
      .replace(/\s+/g, ' ')
      .trim();

    // 6. Sort highlights by start position
    highlights.sort((a, b) => a.start - b.start);

    return {
      title,
      listName,
      sectionName,
      quantity,
      price,
      rawText: text,
      highlights,
    };
  }
}
