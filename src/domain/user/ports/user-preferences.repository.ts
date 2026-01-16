import type { CreateUseCase, UpdateUseCase } from '../../common';
import type {
  CreateUserPreferencesInput,
  UpdateUserPreferencesInput,
  UserPreferences,
} from '../entities/user-preferences.entity';

export interface UserPreferencesRepository
  extends
    CreateUseCase<UserPreferences, CreateUserPreferencesInput>,
    UpdateUseCase<UserPreferences, UpdateUserPreferencesInput> {
  getByUserId(userId: string): Promise<UserPreferences | null>;
}
