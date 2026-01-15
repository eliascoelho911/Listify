export type Tag = {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
};

export type CreateTagInput = Omit<Tag, 'id' | 'createdAt'>;

export type UpdateTagInput = Partial<Omit<Tag, 'id' | 'createdAt'>>;
