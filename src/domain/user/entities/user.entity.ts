export type User = {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt'>>;
