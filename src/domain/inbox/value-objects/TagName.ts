import { MAX_TAG_LENGTH, TAG_NAME_REGEX } from '../constants';

/**
 * Value object para nome de tag normalizado.
 *
 * Garante que nomes de tags são válidos e normalizados:
 * - Lowercase
 * - Máximo 30 caracteres
 * - Apenas letras (incluindo acentos), números e underscore
 */
export type TagName = {
  readonly value: string;
};

export type TagNameValidationError =
  | { type: 'empty' }
  | { type: 'too_long'; maxLength: number }
  | { type: 'invalid_characters' };

export type TagNameResult =
  | { success: true; tagName: TagName }
  | { success: false; error: TagNameValidationError };

/**
 * Creates a validated TagName from a raw string.
 *
 * @param raw - Raw tag name (may include # prefix)
 * @returns TagNameResult with success or error
 */
export function createTagName(raw: string): TagNameResult {
  const withoutHash = raw.startsWith('#') ? raw.slice(1) : raw;
  const normalized = withoutHash.toLowerCase().trim();

  if (normalized.length === 0) {
    return { success: false, error: { type: 'empty' } };
  }

  if (normalized.length > MAX_TAG_LENGTH) {
    return { success: false, error: { type: 'too_long', maxLength: MAX_TAG_LENGTH } };
  }

  if (!TAG_NAME_REGEX.test(normalized)) {
    return { success: false, error: { type: 'invalid_characters' } };
  }

  return { success: true, tagName: { value: normalized } };
}

/**
 * Checks if a raw string is a valid tag name.
 *
 * @param raw - Raw tag name to validate
 * @returns true if valid, false otherwise
 */
export function isValidTagName(raw: string): boolean {
  return createTagName(raw).success;
}
