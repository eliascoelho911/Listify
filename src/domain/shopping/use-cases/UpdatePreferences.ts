import type { ShoppingList } from '../entities/ShoppingList';
import type { ShoppingRepository, UpdateListPreferencesInput } from '../ports/ShoppingRepository';

export type UpdatePreferencesDeps = {
  repository: ShoppingRepository;
};

export async function updatePreferences(
  input: UpdateListPreferencesInput,
  deps: UpdatePreferencesDeps,
): Promise<ShoppingList> {
  return deps.repository.updateListPreferences(input);
}
