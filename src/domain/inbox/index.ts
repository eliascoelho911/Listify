/**
 * Inbox Domain Barrel Export
 */

// Entities
export type { DateGroup, InputTag, PaginatedUserInputs, Tag, UserInput } from './entities';

// Value Objects
export {
  createTagName,
  isValidTagName,
  type TagName,
  type TagNameResult,
  type TagNameValidationError,
} from './value-objects/TagName';

// Ports
export type {
  CreateUserInputParams,
  GetUserInputsParams,
  InboxRepository,
  SearchTagsParams,
  UpdateUserInputParams,
} from './ports/InboxRepository';

// Use Cases
export type {
  CreateUserInputResult,
  SearchTagsFunction,
  SearchTagsInput,
  UpdateUserInputResult,
} from './use-cases';
export {
  createUserInput,
  DeleteUserInput,
  EmptyTextError,
  extractTags,
  GetUserInputs,
  GetUserInputsGrouped,
  InvalidTagNameError,
  SearchTags,
  TextTooLongError,
  UpdateUserInput,
  UserInputNotFoundError,
} from './use-cases';

// Constants
export {
  DEFAULT_PAGE_SIZE,
  MAX_TAG_LENGTH,
  MAX_TEXT_LENGTH,
  TAG_NAME_REGEX,
  TAG_REGEX,
} from './constants';
