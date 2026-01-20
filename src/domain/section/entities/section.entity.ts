export type Section = {
  id: string;
  listId: string;
  name: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSectionInput = Omit<Section, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateSectionInput = Partial<Omit<Section, 'id' | 'listId' | 'createdAt'>>;
