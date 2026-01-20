import type { Entity, Sortable, Timestamped } from '@domain/common';

export type Section = Entity &
  Sortable &
  Timestamped & {
    listId: string;
    name: string;
  };

export type CreateSectionInput = Omit<Section, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateSectionInput = Partial<Omit<Section, 'id' | 'listId' | 'createdAt'>>;
