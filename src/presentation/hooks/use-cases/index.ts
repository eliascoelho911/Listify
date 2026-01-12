/**
 * Use Case Hooks
 *
 * These hooks encapsulate domain use cases with repository injection,
 * providing a clean interface for the presentation layer.
 */

export { type CreateUserInputFn, useCreateUserInput } from './useCreateUserInput';
export { type DeleteUserInputFn, useDeleteUserInput } from './useDeleteUserInput';
export { type SearchTagsFn, useSearchTags } from './useSearchTags';
export { type UpdateUserInputFn, useUpdateUserInput } from './useUpdateUserInput';
