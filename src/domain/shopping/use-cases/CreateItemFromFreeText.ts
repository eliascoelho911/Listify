import { Quantity } from '../value-objects/Quantity';
import type { UnitCode } from '../value-objects/Unit';
import { defaultUnitDictionaries, type UnitDictionaries } from '../value-objects/unitDictionaries';

export type CreateItemFromFreeTextResult = {
  name: string;
  quantity: Quantity;
  unit: UnitCode;
  category: string;
};

export type CreateItemFromFreeTextOptions = {
  locale?: string;
  defaultCategory?: string;
  dictionaries?: UnitDictionaries;
};

export class EmptyItemNameError extends Error {
  constructor() {
    super('Item name cannot be empty after parsing.');
    this.name = 'EmptyItemNameError';
  }
}

export function createItemFromFreeText(
  text: string,
  options: CreateItemFromFreeTextOptions = {},
): CreateItemFromFreeTextResult {
  const trimmed = text?.trim() ?? '';
  if (!trimmed) {
    throw new EmptyItemNameError();
  }

  const { remainingText, category } = extractCategory(trimmed, options);
  const tokens = tokenize(remainingText);

  let currentIndex = 0;
  const quantityCandidate = tryParseQuantity(tokens[0]);
  const quantity = quantityCandidate ?? Quantity.default();
  if (quantityCandidate) {
    currentIndex += 1;
  }

  const unitCandidate = tryParseUnit(tokens[currentIndex], options);
  const unit: UnitCode = unitCandidate ?? 'un';
  if (unitCandidate) {
    currentIndex += 1;
  }

  const nameTokens = tokens.slice(currentIndex);
  const name = nameTokens.join(' ').trim();
  if (!name) {
    throw new EmptyItemNameError();
  }

  return {
    name,
    quantity,
    unit,
    category: normalizeCategory(category, options),
  };
}

function extractCategory(
  text: string,
  options: CreateItemFromFreeTextOptions,
): { remainingText: string; category?: string } {
  const matches = Array.from(text.matchAll(/@([^\s@]+)/g));
  const lastCategory = matches.at(-1)?.[1];
  const remainingText = text
    .replace(/@([^\s@]+)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    remainingText,
    category: lastCategory ?? options.defaultCategory,
  };
}

function normalizeCategory(
  category: string | undefined,
  options: CreateItemFromFreeTextOptions,
): string {
  const normalized = (category ?? options.defaultCategory ?? 'outros').trim();
  return normalized.toLowerCase();
}

function tokenize(text: string): string[] {
  const tokens = text.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    throw new EmptyItemNameError();
  }
  return tokens;
}

function tryParseQuantity(token: string | undefined): Quantity | null {
  if (!token) {
    return null;
  }

  try {
    return Quantity.parse(token);
  } catch {
    return null;
  }
}

function tryParseUnit(
  token: string | undefined,
  options: CreateItemFromFreeTextOptions,
): UnitCode | null {
  if (!token) {
    return null;
  }

  const normalized = token.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const dictionaries = options.dictionaries ?? defaultUnitDictionaries;
  const locale = (options.locale ?? 'pt').toLowerCase();
  const localeBase = locale.split('-')[0];

  const lookupOrder = [dictionaries[locale], dictionaries[localeBase], dictionaries.default];
  for (const dictionary of lookupOrder) {
    if (dictionary && dictionary[normalized]) {
      return dictionary[normalized];
    }
  }

  return null;
}
