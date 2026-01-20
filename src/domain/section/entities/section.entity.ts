import type { Sortable } from '@domain/common';

export type Section = Sortable & {
  id: string;
  listId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSectionInput = Omit<Section, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateSectionInput = Partial<Omit<Section, 'id' | 'listId' | 'createdAt'>>;
