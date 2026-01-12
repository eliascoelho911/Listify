/** Maximum length for user input text */
export const MAX_TEXT_LENGTH = 5000;

/** Maximum length for tag names */
export const MAX_TAG_LENGTH = 30;

/** Default page size for pagination */
export const DEFAULT_PAGE_SIZE = 20;

/** Regex to extract tags from text (matches #tag pattern) */
export const TAG_REGEX = /#([a-zA-ZÀ-ÿ0-9_]+)/g;

/** Regex to validate tag name characters (without #) */
export const TAG_NAME_REGEX = /^[a-zA-ZÀ-ÿ0-9_]+$/;
