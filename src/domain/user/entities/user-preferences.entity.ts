import type { LayoutConfig } from '../../common';
import type { ItemGroupCriteria } from '../../item';

export type Theme = 'light' | 'dark' | 'auto';

// Chaves especiais para abas do app
export type SpecialLayoutKey = 'inbox' | 'notes';

// Configurações de layout por lista ou aba especial
// Chaves podem ser: listId (string) | 'inbox' | 'notes'
export type LayoutConfigs = Record<string, LayoutConfig<ItemGroupCriteria>>;

export type UserPreferences = {
  id: string;
  userId: string;
  theme: Theme;
  primaryColor?: string;
  layoutConfigs: LayoutConfigs;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserPreferencesInput = Omit<UserPreferences, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUserPreferencesInput = Partial<
  Omit<UserPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>;
