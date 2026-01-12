import { MAX_TAG_LENGTH, TAG_REGEX } from '../constants';
import { createTagName } from '../value-objects/TagName';

export type ExtractTagsInput = {
  /** Texto contendo #tags */
  text: string;
};

export type ExtractTagsOutput = {
  /** Nomes das tags extraídas (normalizados) */
  tagNames: string[];

  /** Texto sem as tags (para preview, opcional) */
  textWithoutTags: string;
};

/**
 * Extracts tags from text (pure function, no IO).
 *
 * Responsibilities:
 * 1. Detect #word pattern in text
 * 2. Normalize (lowercase, remove duplicates)
 * 3. Validate (max 30 chars, allowed characters)
 *
 * @param input - Text with possible tags
 * @returns Extracted tags and text without tags
 */
export function extractTags(input: ExtractTagsInput): ExtractTagsOutput {
  const { text } = input;

  const matches = text.matchAll(TAG_REGEX);
  const rawTagNames = [...matches].map((m) => m[1]);

  const validTagNames: string[] = [];
  for (const rawName of rawTagNames) {
    if (rawName.length > MAX_TAG_LENGTH) {
      continue;
    }

    const result = createTagName(rawName);
    if (result.success) {
      validTagNames.push(result.tagName.value);
    }
  }

  const uniqueTagNames = [...new Set(validTagNames)];

  const textWithoutTags = text.replace(TAG_REGEX, '').replace(/\s+/g, ' ').trim();

  return {
    tagNames: uniqueTagNames,
    textWithoutTags,
  };
}
