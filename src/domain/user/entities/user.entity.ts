import type { Entity, Timestamped } from '@domain/common';

export type User = Entity &
  Timestamped & {
    name: string;
    email: string;
    photoUrl?: string;
  };

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt'>>;
